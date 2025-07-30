load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"[DEBUG] GEMINI_API_KEY: {GEMINI_API_KEY}")