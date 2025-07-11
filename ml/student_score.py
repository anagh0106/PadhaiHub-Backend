import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle
import os

file_path = "Stu_hour_score.xlsx"

# Load or create dataset
def load_dataset():
    if os.path.exists(file_path):
        return pd.read_excel(file_path)
    else:
        return pd.DataFrame(columns=["hours", "score"])

# Save the trained model
def save_model(model, path='model.pkl'):
    with open(path, 'wb') as file:
        pickle.dump(model, file)

def train_model(df):
    x = df[['hours']]
    y = df['score']
    model = LinearRegression()
    model.fit(x, y)
    return model

def main():
    df = load_dataset()

    try:
        new_hours = float(input("📥 Enter number of study hours: "))
    except ValueError:
        print("❌ Invalid input")
        return

    model = train_model(df)
    predicted_score = model.predict([[new_hours]])[0]
    print(f"📊 Predicted Score: {predicted_score:.2f}")

    new_entry = pd.DataFrame({"hours": [new_hours], "score": [predicted_score]})
    df = pd.concat([df, new_entry], ignore_index=True)
    df.to_excel(file_path, index=False)

    print("📝 New input saved to Stu_hour_score.xlsx")

    model = train_model(df)
    save_model(model)
    print("✅ Model retrained and saved as model.pkl")

if __name__ == "__main__":
    main()
