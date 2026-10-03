#!/usr/bin/env python3
"""
Create a demo notice image for testing Notice2Action
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_demo_notice():
    # Create image
    width, height = 800, 1000
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    
    # Try to use a default font
    try:
        title_font = ImageFont.truetype("arial.ttf", 36)
        heading_font = ImageFont.truetype("arial.ttf", 24)
        body_font = ImageFont.truetype("arial.ttf", 18)
    except:
        title_font = ImageFont.load_default()
        heading_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
    
    # Colors
    blue = '#2563eb'
    black = '#000000'
    red = '#dc2626'
    
    y_position = 50
    
    # Title
    draw.text((50, y_position), "COLLEGE PROJECT PRESENTATION NOTICE", 
              fill=blue, font=title_font)
    y_position += 80
    
    # Subtitle
    draw.text((50, y_position), "FINAL-YEAR B.TECH PROJECT NOTICE", 
              fill=black, font=heading_font)
    y_position += 60
    
    # Important Dates
    draw.text((50, y_position), "IMPORTANT DATES:", fill=red, font=heading_font)
    y_position += 40
    draw.text((70, y_position), "• Registration Deadline: October 10, 2026", 
              fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "• Project Submission: October 12, 2026", 
              fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "• Project Presentation: October 15, 2026", 
              fill=black, font=body_font)
    y_position += 60
    
    # Venue
    draw.text((50, y_position), "VENUE:", fill=red, font=heading_font)
    y_position += 40
    draw.text((70, y_position), "Seminar Hall, Block B", fill=black, font=body_font)
    y_position += 60
    
    # Eligibility
    draw.text((50, y_position), "ELIGIBILITY:", fill=red, font=heading_font)
    y_position += 40
    draw.text((70, y_position), "• B.Tech final-year students", fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "• Registered project groups only", fill=black, font=body_font)
    y_position += 60
    
    # Required Items
    draw.text((50, y_position), "REQUIRED ITEMS:", fill=red, font=heading_font)
    y_position += 40
    draw.text((70, y_position), "• Project report (hard copy + soft copy)", 
              fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "• Presentation slides", fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "• College ID card", fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "• Registration confirmation", fill=black, font=body_font)
    y_position += 60
    
    # Important Instructions
    draw.text((50, y_position), "IMPORTANT INSTRUCTIONS:", fill=red, font=heading_font)
    y_position += 40
    draw.text((70, y_position), "1. Registration must be completed before submission", 
              fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "2. Projects must follow college guidelines", 
              fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "3. Presentation slots will be assigned", 
              fill=black, font=body_font)
    y_position += 60
    
    # Warnings
    draw.text((50, y_position), "WARNINGS:", fill=red, font=heading_font)
    y_position += 40
    draw.text((70, y_position), "• Late submissions will not be accepted", 
              fill=black, font=body_font)
    y_position += 30
    draw.text((70, y_position), "• Incomplete documentation will result in disqualification", 
              fill=black, font=body_font)
    y_position += 60
    
    # Contact
    draw.text((50, y_position), "CONTACT:", fill=blue, font=heading_font)
    y_position += 40
    draw.text((70, y_position), "Project Coordinator, Department Office", 
              fill=black, font=body_font)
    
    # Save image
    output_path = "samples/college_notice_demo.png"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    image.save(output_path, 'PNG')
    print(f"Demo notice created: {output_path}")

if __name__ == "__main__":
    create_demo_notice()