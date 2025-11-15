export function generateInvoiceHtml(
  invoiceNumber: string,
  purchaseDate: string,
  assetTitle: string,
  price: number,
): string {
  const formattedDate = new Date(purchaseDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedPrice = (price / 100).toFixed(2);

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .invoice { max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; }
      .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
      .row { margin-bottom: 10px; }
      .label { font-weight: bold; }
      .value { margin-left: 5px; }
      .footer { margin-top: 20px; font-size: 14px; color: #777; }
    </style>
  </head>
  <body>
    <div class="invoice">
      <div class="header">Invoice</div>

      <div class="row">
        <span class="label">Invoice Number:</span>
        <span class="value">${invoiceNumber}</span>
      </div>

      <div class="row">
        <span class="label">Date:</span>
        <span class="value">${formattedDate}</span>
      </div>

      <div class="row">
        <span class="label">Item:</span>
        <span class="value">${assetTitle}</span>
      </div>

      <div class="row">
        <span class="label">Price:</span>
        <span class="value">$${formattedPrice}</span>
      </div>

      <div class="footer">
        Thank you for your purchase.
      </div>
    </div>
  </body>
  </html>
  `;
}
