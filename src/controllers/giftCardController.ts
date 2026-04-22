import { GiftCard } from '../models/GiftCard.js';
import { emitUpdate } from '../lib/socket.js';

// Gestão de Cartões Presente
const generateGiftCardCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SF-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createGiftCardDraft = async (req: any, res: any) => {
  try {
    const { value, recipientName, recipientEmail, recipientWhatsApp, message, isScheduled, scheduledDate } = req.body;
    
    const giftCard = new GiftCard({
      value,
      balance: value,
      sender: req.user?._id,
      recipientName,
      recipientEmail,
      recipientWhatsApp,
      message,
      isScheduled,
      scheduledDate,
      status: 'draft'
    });

    const savedGiftCard = await giftCard.save();
    res.status(201).json(savedGiftCard);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const validateGiftCard = async (req: any, res: any) => {
  try {
    const { code } = req.params;
    
    // Safety check for empty code
    if (!code || code.length < 5) {
      return res.status(400).json({ message: 'Código inválido.' });
    }

    const giftCard = await GiftCard.findOne({ code, status: 'active' });

    if (!giftCard) {
      // Log failed attempt for security (brute force prevention)
      console.warn(`Tentativa de validação falhou para código: ${code} IP: ${req.ip}`);
      return res.status(404).json({ message: 'Cartão presente inválido ou já utilizado.' });
    }

    if (giftCard.expiryDate && new Date(giftCard.expiryDate as any) < new Date()) {
      giftCard.status = 'expired';
      await giftCard.save();
      return res.status(400).json({ message: 'Este cartão presente expirou.' });
    }

    if (giftCard.balance <= 0) {
      return res.status(400).json({ message: 'Este cartão presente não tem saldo.' });
    }

    res.json({
      code: giftCard.code,
      value: giftCard.value,
      balance: giftCard.balance,
      recipientName: giftCard.recipientName
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Functions
export const getAllGiftCards = async (req: any, res: any) => {
  try {
    const giftCards = await GiftCard.find().sort({ createdAt: -1 });
    res.json(giftCards);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGiftCard = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Auto-update status based on balance if balance is provided
    if (updateData.balance !== undefined) {
      if (updateData.balance <= 0) {
        updateData.status = 'used';
      } else if (updateData.status === 'used' || !updateData.status) {
        // Only reactivate if it was 'used' or no status provided (implying we should be active)
        const current = await GiftCard.findById(id);
        if (current && (current.status === 'used' || current.status === 'expired')) {
          updateData.status = 'active';
        }
      }
    }

    const updated = await GiftCard.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Cartão não encontrado' });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGiftCard = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'ID do cartão inválido ou ausente.' });
    }

    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
      return res.status(404).json({ message: 'Cartão presente não encontrado no banco de dados.' });
    }

    const cardCode = giftCard.code || 'DRAFT';
    
    // Deleta permanentemente
    await GiftCard.deleteOne({ _id: id });
    
    // Notifica outros clientes via socket
    emitUpdate('giftCards', { _id: id, deleted: true });
    
    console.log(`[ADMIN] Cartão [${cardCode}] (ID: ${id}) EXCLUÍDO PERMANENTEMENTE por ${req.user?.email}`);

    res.json({ 
      success: true,
      message: `Cartão [${cardCode}] foi totalmente removido do sistema.`,
      deletedId: id
    });
  } catch (error: any) {
    console.error('ERRO CRÍTICO AO DELETAR CARTÃO:', error);
    res.status(500).json({ 
      success: false,
      message: 'Falha técnica ao excluir cartão: ' + (error.message || 'Erro desconhecido')
    });
  }
};

export const resendGiftCardEmail = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const giftCard = await GiftCard.findById(id);
    if (!giftCard) return res.status(404).json({ message: 'Cartão não encontrado' });
    
    if (giftCard.status !== 'active') {
      return res.status(400).json({ message: 'Apenas cartões ativos podem ser reenviados.' });
    }

    // Mock professional email logic
    console.log(`--- SIMULAÇÃO DE EMAIL PROFISSIONAL ---`);
    console.log(`Para: ${giftCard.recipientEmail}`);
    console.log(`Assunto: Você recebeu um cartão presente SambaFit! 🎁`);
    console.log(`Mensagem: Olá ${giftCard.recipientName}, você recebeu um cartão presente de valor €${giftCard.value}.`);
    console.log(`Código para usar no checkout: ${giftCard.code}`);
    console.log(`Mensagem Personalizada: "${giftCard.message || 'Esperamos que goste!'}"`);
    console.log(`----------------------------------------`);

    res.json({ message: 'Email de presente reenviado com sucesso (Simulado)' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Internal function to activate gift card after payment
export const activateGiftCard = async (giftCardId: string, orderId: string) => {
  try {
    const code = generateGiftCardCode();
    const giftCard = await GiftCard.findByIdAndUpdate(giftCardId, {
      code,
      status: 'active',
      orderId,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year expiry
    }, { new: true });

    if (giftCard) {
      // Simulate sending the first email upon activation
      console.log(`--- EMAIL DE ATIVAÇÃO ENVIADO ---`);
      console.log(`Para: ${giftCard.recipientEmail}`);
      console.log(`Código: ${code}`);
      console.log(`---------------------------------`);
    }

    return code;
  } catch (error) {
    console.error('Error activating gift card:', error);
    throw error;
  }
};
