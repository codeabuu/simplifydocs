from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from  reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

def generate_pdf(summary, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    #add title
    title = Paragraph("Summary of the PDF", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))

    #add summary txt
    summary_paragraph = Paragraph(summary, styles['BodyText'])
    story.append(summary_paragraph)

    #build the pdf
    doc.build(story)