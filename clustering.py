# clustering.py

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

# 데이터 파일 불러오기
def load_data(file_path):
    return pd.read_csv(file_path)

# 데이터 전처리
def preprocess_data(df):
    # 필요한 컬럼 선택
    selected_cols = ['temperature', 'mainPressure', 'currentSpeed', 'containerTempFront', 'containerTempBack']
    df = df[selected_cols].dropna()
    
    # 데이터 표준화
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df)
    
    return df, scaled_data, scaler

# 최적 클러스터 수 찾기 (Elbow Method)
def find_optimal_clusters(scaled_data):
    inertia = []
    for k in range(1, 11):
        kmeans = KMeans(n_clusters=k, random_state=42)
        kmeans.fit(scaled_data)
        inertia.append(kmeans.inertia_)
    
    # Elbow Method 그래프
    plt.figure(figsize=(10, 6))
    plt.plot(range(1, 11), inertia, marker='o')
    plt.xlabel('Number of Clusters')
    plt.ylabel('Inertia')
    plt.title('Elbow Method for Optimal Number of Clusters')
    plt.grid(True)
    plt.show()

# 클러스터링 수행
def perform_clustering(scaled_data, df, n_clusters):
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    df['cluster'] = kmeans.fit_predict(scaled_data)
    return df, kmeans

# 클러스터링 시각화
def visualize_clusters(df):
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=df, x='currentSpeed', y='temperature', hue='cluster', palette='Set1', s=100)
    plt.title('Clusters of Temperature vs Current Speed')
    plt.xlabel('Current Speed (mm/s)')
    plt.ylabel('Temperature (°C)')
    plt.grid(True)
    plt.legend()
    plt.show()

# 최적 조건 도출
def get_cluster_centers(kmeans, scaler):
    cluster_centers = scaler.inverse_transform(kmeans.cluster_centers_)
    centers_df = pd.DataFrame(cluster_centers, columns=['temperature', 'mainPressure', 'currentSpeed', 'containerTempFront', 'containerTempBack'])
    return centers_df

# 메인 함수
def main(file_path, n_clusters):
    df = load_data(file_path)
    df, scaled_data, scaler = preprocess_data(df)
    
    # Elbow Method로 최적 클러스터 수 확인
    find_optimal_clusters(scaled_data)
    
    # 클러스터링 수행
    df, kmeans = perform_clustering(scaled_data, df, n_clusters)
    
    # 클러스터 시각화
    visualize_clusters(df)
    
    # 클러스터 중심값 출력
    centers = get_cluster_centers(kmeans, scaler)
    print("Cluster Centers (Temperature, Main Pressure, Current Speed, Container Temp Front, Container Temp Back):")
    print(centers)

# 파일 경로와 클러스터 수 설정
if __name__ == "__main__":
    file_path = r"Z:\Merged_Data_생산일자\필터 데이터\2024-07-23-6_B4582_60272_26.csv"  # 파일 경로를 실제 경로로 수정
    n_clusters = 3                       # 클러스터 수 설정
    main(file_path, n_clusters)
