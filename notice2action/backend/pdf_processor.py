import fitz  # PyMuPDF
import io
from PIL import Image
from typing import List, Optional


class PDFProcessor:
    """Service for processing PDF files and converting them to images."""
    
    @staticmethod
    def pdf_to_images(pdf_bytes: bytes, dpi: int = 150) -> List[Image.Image]:
        """
        Convert PDF bytes to a list of PIL Images.
        
        Args:
            pdf_bytes: Raw bytes of the PDF file
            dpi: Resolution for the conversion (default: 150)
            
        Returns:
            List of PIL Image objects, one per page
        """
        try:
            # Open PDF from bytes
            pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
            images = []
            
            # Convert each page to image
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                
                # Create a matrix for the desired DPI
                mat = fitz.Matrix(dpi / 72, dpi / 72)  # 72 is the default DPI
                
                # Render page to pixmap
                pix = page.get_pixmap(matrix=mat)
                
                # Convert pixmap to PIL Image
                img_data = pix.tobytes("png")
                img = Image.open(io.BytesIO(img_data))
                images.append(img)
            
            pdf_document.close()
            return images
            
        except Exception as e:
            raise ValueError(f"Error processing PDF: {str(e)}")
    
    @staticmethod
    def get_first_page_as_image(pdf_bytes: bytes, dpi: int = 150) -> Image.Image:
        """
        Get the first page of a PDF as a PIL Image.
        
        Args:
            pdf_bytes: Raw bytes of the PDF file
            dpi: Resolution for the conversion (default: 150)
            
        Returns:
            PIL Image of the first page
        """
        images = PDFProcessor.pdf_to_images(pdf_bytes, dpi)
        if not images:
            raise ValueError("PDF appears to be empty")
        return images[0]
    
    @staticmethod
    def combine_pages_vertically(pdf_bytes: bytes, max_pages: int = 3, dpi: int = 150) -> Image.Image:
        """
        Convert PDF pages to images and combine them vertically for better analysis.
        
        Args:
            pdf_bytes: Raw bytes of the PDF file
            max_pages: Maximum number of pages to include (default: 3)
            dpi: Resolution for the conversion (default: 150)
            
        Returns:
            Single PIL Image with pages combined vertically
        """
        try:
            images = PDFProcessor.pdf_to_images(pdf_bytes, dpi)
            
            # Limit to max_pages
            if len(images) > max_pages:
                images = images[:max_pages]
            
            if not images:
                raise ValueError("No pages found in PDF")
            
            if len(images) == 1:
                return images[0]
            
            # Calculate combined dimensions
            total_width = max(img.width for img in images)
            total_height = sum(img.height for img in images)
            
            # Create combined image
            combined = Image.new('RGB', (total_width, total_height), 'white')
            
            # Paste images vertically
            y_offset = 0
            for img in images:
                # Center the image horizontally if it's narrower
                x_offset = (total_width - img.width) // 2
                combined.paste(img, (x_offset, y_offset))
                y_offset += img.height
            
            return combined
            
        except Exception as e:
            raise ValueError(f"Error combining PDF pages: {str(e)}")
    
    @staticmethod
    def is_pdf(file_bytes: bytes) -> bool:
        """
        Check if the file bytes represent a PDF file.
        
        Args:
            file_bytes: Raw bytes of the file
            
        Returns:
            True if the file is a PDF, False otherwise
        """
        return file_bytes.startswith(b'%PDF')
    
    @staticmethod
    def get_pdf_info(pdf_bytes: bytes) -> dict:
        """
        Get basic information about a PDF file.
        
        Args:
            pdf_bytes: Raw bytes of the PDF file
            
        Returns:
            Dictionary with PDF information
        """
        try:
            pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
            
            info = {
                "page_count": len(pdf_document),
                "metadata": pdf_document.metadata,
                "has_text": False,
                "has_images": False
            }
            
            # Check first page for content
            if len(pdf_document) > 0:
                page = pdf_document.load_page(0)
                text = page.get_text().strip()
                info["has_text"] = bool(text)
                
                image_list = page.get_images()
                info["has_images"] = len(image_list) > 0
            
            pdf_document.close()
            return info
            
        except Exception as e:
            return {"error": f"Error reading PDF info: {str(e)}"}