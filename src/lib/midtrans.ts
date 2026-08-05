import midtransClient from 'midtrans-client';

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

// Create Snap API instance
export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'dummy_client_key'
});

// Create Core API instance (if you need server-to-server calls instead of Snap UI)
export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'dummy_client_key'
});

export type MidtransCustomerDetails = {
  first_name: string;
  email: string;
  phone?: string;
};

export type MidtransItemDetails = {
  id: string;
  price: number;
  quantity: number;
  name: string;
};

/**
 * Helper to create a Snap transaction
 */
export async function createSnapTransaction(
  orderId: string, 
  grossAmount: number, 
  customerDetails: MidtransCustomerDetails,
  itemDetails?: MidtransItemDetails[]
) {
  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      customer_details: customerDetails,
      item_details: itemDetails,
      // Optional: Add callbacks if needed
      // callbacks: {
      //   finish: "https://yourdomain.com/payment/finish"
      // }
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction; // Returns { token, redirect_url }
  } catch (error) {
    console.error("Failed to create Midtrans transaction:", error);
    throw error;
  }
}
