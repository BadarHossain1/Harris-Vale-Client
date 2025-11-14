/**
 * Utility functions for invoice generation and download
 */

/**
 * Download invoice for a specific order
 * @param {string} orderId - MongoDB _id of the order
 * @param {string} orderNumber - Display order number (e.g., HV20241114001)
 */
export const downloadInvoice = async (orderId, orderNumber) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Show loading toast
        console.log(`📄 Downloading invoice for order: ${orderNumber}`);
        
        // Fetch the invoice PDF
        const response = await fetch(`${API_URL}/api/invoice/${orderId}/download`);
        
        if (!response.ok) {
            throw new Error('Failed to generate invoice');
        }
        
        // Get the PDF blob
        const blob = await response.blob();
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice_${orderNumber}.pdf`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Invoice downloaded successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Error downloading invoice:', error);
        throw error;
    }
};

/**
 * Preview invoice in a new tab
 * @param {string} orderId - MongoDB _id of the order
 */
export const previewInvoice = async (orderId) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        console.log(`👁️ Previewing invoice for order: ${orderId}`);
        
        // Fetch the invoice preview (base64)
        const response = await fetch(`${API_URL}/api/invoice/${orderId}/preview`);
        
        if (!response.ok) {
            throw new Error('Failed to generate invoice preview');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.pdfBase64) {
            // Convert base64 to blob
            const byteCharacters = atob(data.data.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            
            // Open in new tab
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            
            // Cleanup after a delay
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);
            
            console.log('✅ Invoice preview opened');
            return true;
        } else {
            throw new Error('Invalid response from server');
        }
        
    } catch (error) {
        console.error('❌ Error previewing invoice:', error);
        throw error;
    }
};

/**
 * Download multiple invoices at once
 * @param {Array} orderIds - Array of MongoDB _ids
 */
export const bulkDownloadInvoices = async (orderIds) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        console.log(`📄 Downloading ${orderIds.length} invoices...`);
        
        // Fetch bulk invoices
        const response = await fetch(`${API_URL}/api/invoice/bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderIds })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate invoices');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            // Download each invoice
            for (const invoice of data.data) {
                // Convert base64 to blob
                const byteCharacters = atob(invoice.pdfBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = invoice.filename;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                
                // Cleanup
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                // Small delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            console.log(`✅ ${data.data.length} invoices downloaded successfully`);
            return true;
        } else {
            throw new Error('Invalid response from server');
        }
        
    } catch (error) {
        console.error('❌ Error downloading bulk invoices:', error);
        throw error;
    }
};
