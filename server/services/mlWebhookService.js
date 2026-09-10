const ML_WEBHOOK_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/webhook/refund-submitted';

export async function dispatchRefundToMlService(refundData) {
  try {
    console.log(`📡 Dispatching webhook for Refund Ticket #${refundData.id} to ML Service (${ML_WEBHOOK_URL})...`);

    const response = await fetch(ML_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refundId: refundData.id,
        orderId: refundData.orderId,
        userId: refundData.userId,
        restaurantId: refundData.restaurantId,
        restaurantName: refundData.restaurantName || 'BiteHub Partner',
        customerName: refundData.customerName || '',
        customerEmail: refundData.customerEmail || '',
        customerPhone: refundData.customerPhone || '',
        amount: refundData.amount,
        reason: refundData.reason,
        description: refundData.description,
        image: refundData.image,
        submittedAt: refundData.createdAt || new Date().toISOString(),
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ ML Service responded to webhook:`, result);
      return result;
    } else {
      console.warn(`⚠️ ML Service webhook returned HTTP status ${response.status}`);
    }
  } catch {
    console.log(`ℹ️ ML Service webhook notice: ${ML_WEBHOOK_URL} is offline or not responding. (Refund ticket saved normally in BiteHub).`);
  }
  return null;
}
