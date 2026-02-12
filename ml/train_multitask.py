import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np

# Dummy dataset (images aléatoires pour structure)
X = np.random.rand(200, 224, 224, 3).astype("float32")

# 3 sorties
y_diabetes = np.random.rand(200, 1)
y_anemia = np.random.rand(200, 1)
y_nutrition = np.random.rand(200, 1)

# Base CNN
inputs = layers.Input(shape=(224, 224, 3))
x = layers.Conv2D(16, 3, activation="relu")(inputs)
x = layers.MaxPooling2D()(x)
x = layers.Conv2D(32, 3, activation="relu")(x)
x = layers.MaxPooling2D()(x)
x = layers.Flatten()(x)
x = layers.Dense(64, activation="relu")(x)

out1 = layers.Dense(1, activation="sigmoid", name="diabetes")(x)
out2 = layers.Dense(1, activation="sigmoid", name="anemia")(x)
out3 = layers.Dense(1, activation="sigmoid", name="nutrition")(x)

model = models.Model(inputs=inputs, outputs=[out1, out2, out3])

model.compile(
    optimizer="adam",
    loss="binary_crossentropy"
)

model.fit(
    X,
    [y_diabetes, y_anemia, y_nutrition],
    epochs=5
)

model.save("multitask_model.h5")
print("✅ Model trained and saved")
