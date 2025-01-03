from gtts import gTTS
import os

def convert_text_to_speech(text, lang='en', output_file='output.mp3'):
    try:
        tts = gTTS(text=text, lang=lang)
        tts.save(output_file)
        os.system(f"mpg321 {output_file}")
        return output_file
    except Exception as e:
        print(f"Error during conversion: {e}")
        return None