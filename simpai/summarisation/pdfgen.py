from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.enums import TA_JUSTIFY

def generate_pdf(summary, output_path):
    # Create a PDF document
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Add a title
    title = Paragraph("Summary Report", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))

    # Split the summary into lines
    lines = summary.split('\n')

    # Process each line
    for line in lines:
        line = line.strip()
        if line.startswith('**'):
            # Bold text for headings
            story.append(Paragraph(line.strip('**'), styles['Heading2']))
            story.append(Spacer(1, 6))
        elif line.startswith('-') or line.startswith('*') or line.startswith('1.'):
            # Bullet points or numbered lists
            bullet = line[1:].strip()  # Remove the bullet or number
            story.append(ListFlowable([
                ListItem(Paragraph(bullet, styles['BodyText']))
            ]))
        else:
            # Regular paragraphs
            story.append(Paragraph(line, styles['BodyText']))
        story.append(Spacer(1, 6))

    # Build the PDF
    doc.build(story)