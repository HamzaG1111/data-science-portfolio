# Used Car Price Prediction Using Machine Learning

## Project Overview

This project explores whether vehicle age, mileage, brand, engine size,
and fuel type can be used to predict the listed price of a used car.

The project uses Python and machine-learning techniques to clean and explore
the data, build prediction models, evaluate their performance, and interpret
the final results.

## Research Question

Can vehicle age, mileage, brand, engine size, and fuel type predict the
listed price of a used car?

## Machine Learning Models

The project compares:

- Baseline Dummy Regressor
- Linear Regression
- Random Forest Regressor
- Tuned Random Forest Regressor

The Tuned Random Forest produced the best overall performance.

## Final Model Performance

- MAE: approximately $8,768
- RMSE: approximately $16,153
- R²: approximately 0.792

The final model explained approximately 79.2% of the variation in used-car
listed prices in the modeling dataset.

## Tools Used

- Python
- Pandas
- NumPy
- Matplotlib
- Scikit-learn
- Jupyter Notebook

## Dataset

Used Car Price Prediction Dataset from Kaggle.

Original dataset size: 4,009 vehicle listings.

## Files

- `used_car_price_prediction.ipynb` — complete analysis and machine-learning project
- `used_cars.csv` — original dataset used by the notebook

## AI Usage

ChatGPT (OpenAI, GPT-5.6 Sol) was used as a learning and coding assistant
to help explain concepts, troubleshoot code, organize the analysis, and
improve written explanations. All code was run and reviewed using the
project dataset.
