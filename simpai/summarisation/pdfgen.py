from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib import colors
import os

def generate_pdf(summary, output_path):
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Create a PDF document
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()

    # Modify existing styles for better formatting
    styles['Title'].fontName = 'Helvetica-Bold'
    styles['Title'].fontSize = 18
    styles['Title'].leading = 24
    styles['Title'].spaceAfter = 12
    styles['Title'].textColor = colors.darkblue

    styles['Heading1'].fontName = 'Helvetica-Bold'
    styles['Heading1'].fontSize = 16
    styles['Heading1'].leading = 20
    styles['Heading1'].spaceAfter = 10
    styles['Heading1'].textColor = colors.darkblue

    styles['Heading2'].fontName = 'Helvetica-Bold'
    styles['Heading2'].fontSize = 14
    styles['Heading2'].leading = 18
    styles['Heading2'].spaceAfter = 8
    styles['Heading2'].textColor = colors.darkblue

    styles['BodyText'].fontName = 'Helvetica'
    styles['BodyText'].fontSize = 12
    styles['BodyText'].leading = 14
    styles['BodyText'].spaceAfter = 6
    styles['BodyText'].alignment = TA_JUSTIFY
    styles['BodyText'].textColor = colors.black

    # Custom style for bullet points
    styles.add(ParagraphStyle(
        name='BulletText',
        parent=styles['BodyText'],
        leftIndent=10,
        spaceBefore=6,
        spaceAfter=6,
    ))

    # Custom style for bold text
    styles.add(ParagraphStyle(
        name='BoldText',
        parent=styles['BodyText'],
        fontName='Helvetica-Bold',
    ))

    story = []

    # Add a title
    title = Paragraph("Summary Report", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))

    # Split the summary into lines
    lines = summary.split('\n')

    # Process each line
    bullet_items = []  # Store list items temporarily
    numbered_items = []  # Store numbered list items temporarily
    for line in lines:
        line = line.strip()
        if not line:
            continue  # Skip empty lines

        if line.startswith('##'):
            # Heading level 2
            if bullet_items:
                story.append(ListFlowable(bullet_items, bulletType='bullet'))
                bullet_items = []
            if numbered_items:
                story.append(ListFlowable(numbered_items, bulletType='1'))
                numbered_items = []
            story.append(Paragraph(line.strip('#').strip(), styles['Heading2']))
            story.append(Spacer(1, 6))
        elif line.startswith('#'):
            # Heading level 1
            if bullet_items:
                story.append(ListFlowable(bullet_items, bulletType='bullet'))
                bullet_items = []
            if numbered_items:
                story.append(ListFlowable(numbered_items, bulletType='1'))
                numbered_items = []
            story.append(Paragraph(line.strip('#').strip(), styles['Heading1']))
            story.append(Spacer(1, 6))
        elif line.startswith('- ') or line.startswith('* '):
            # Bullet points
            bullet = line[2:].strip()  # Remove the bullet
            # Handle bold text within bullet points
            if '**' in bullet:
                parts = bullet.split('**')
                formatted_bullet = []
                for i, part in enumerate(parts):
                    if i % 2 == 1:  # Odd indices are bold text
                        formatted_bullet.append(f"<b>{part}</b>")
                    else:
                        formatted_bullet.append(part)
                bullet = ''.join(formatted_bullet)
            bullet_items.append(ListItem(Paragraph(bullet, styles['BulletText'])))
        elif line.startswith('1. '):
            # Numbered lists
            numbered_item = line[3:].strip()  # Remove the number
            # Handle bold text within numbered items
            if '**' in numbered_item:
                parts = numbered_item.split('**')
                formatted_numbered_item = []
                for i, part in enumerate(parts):
                    if i % 2 == 1:  # Odd indices are bold text
                        formatted_numbered_item.append(f"<b>{part}</b>")
                    else:
                        formatted_numbered_item.append(part)
                numbered_item = ''.join(formatted_numbered_item)
            numbered_items.append(ListItem(Paragraph(numbered_item, styles['BulletText'])))
        else:
            # Regular paragraphs
            if bullet_items:
                story.append(ListFlowable(bullet_items, bulletType='bullet'))
                bullet_items = []
            if numbered_items:
                story.append(ListFlowable(numbered_items, bulletType='1'))
                numbered_items = []
            # Handle bold text within paragraphs
            if '**' in line:
                parts = line.split('**')
                formatted_line = []
                for i, part in enumerate(parts):
                    if i % 2 == 1:  # Odd indices are bold text
                        formatted_line.append(f"<b>{part}</b>")
                    else:
                        formatted_line.append(part)
                line = ''.join(formatted_line)
            story.append(Paragraph(line, styles['BodyText']))
            story.append(Spacer(1, 6))

    # Ensure any remaining bullets or numbered items are added
    if bullet_items:
        story.append(ListFlowable(bullet_items, bulletType='bullet'))
    if numbered_items:
        story.append(ListFlowable(numbered_items, bulletType='1'))

    # Build the PDF
    doc.build(story)