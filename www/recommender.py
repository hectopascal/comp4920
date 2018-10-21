#!/usr/local/bin/python3

# Followed the following link to create this simple recmommendation
# http://computerscience.fyi/which-book-should-i-read-next-recommendation-engine-with-item-item-collaborative-filtering/
# Based on cosine similiarity - https://en.wikipedia.org/wiki/Cosine_similarity

import pandas as pd
import numpy as np
import math
from scipy.spatial.distance import cosine

def main():
    # import the postgre db as csv and parse into pandas
    # https://stackoverflow.com/questions/2987433/how-to-import-csv-file-data-into-a-postgresql-table
    reviews = pd.read_csv('../db/course_review.csv', delimiter=',', header=0, names=['course','student','rating'])
    # print(reviews.head(5))
    user_reviews_matrix = pd.pivot_table(reviews, index='student', columns='course', values='rating',aggfunc='first')

    # user_reviews_matrix = user_reviews_matrix.fillna(0) // Fill empty spaces with 0

    title_similarities = pd.DataFrame(index=user_reviews_matrix.columns, columns=user_reviews_matrix.columns)
    # fill above table frame with the cosine distance between every course
    num_titles = len(title_similarities.columns)
    for i in range(0, num_titles):
        print(i, 'of ', num_titles)
        for j in range(0, num_titles):
            title_similarities.iloc[i,j] = 1 - cosine(user_reviews_matrix.iloc[:,i], user_reviews_matrix.iloc[:,j])

    # Recommends the top 15 courses to take (empty table)
    recommendations = pd.DataFrame(index=title_similarities.columns, columns=range(1,21))

    for i in range(0, len(title_similarities)):
        recommendations.iloc[i,:20] = title_similarities.iloc[0:,i].sort_values(ascending=False)[:20].index
    recommendations.to_csv('../db/course_recommendations.csv')

if (__name__ == '__main__'):
    main();
