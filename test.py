import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrow, Rectangle

def draw_workflow():
    # 폰트 설정
    plt.rcParams['font.family'] = r'C:\\Windows\\Fonts\\34455.ttf'
    plt.rcParams['axes.unicode_minus'] = False

    # 그림 크기 설정
    fig, ax = plt.subplots(figsize=(10, 8))

    # 노드 위치 정의 (x, y 좌표)
    nodes = {
        "start": (0.5, 0.9),
        "step1": (0.5, 0.7),
        "step2": (0.5, 0.5),
        "step3": (0.5, 0.3),
        "step4": (0.2, 0.1),
        "step5": (0.8, 0.1),
    }

    # 노드 텍스트 정의
    labels = {
        "start": "데이터 파일 로드",
        "step1": "데이터 검증",
        "step2": "데이터 전처리 및 표준화",
        "step3": "Elbow Method 실행",
        "step4": "CLustering 수행 및 결과 포맷팅",
        "step5": "결과 저장 및 통계 출력",
    }

    # 노드 그리기
    for node, (x, y) in nodes.items():
        ax.add_patch(Rectangle((x - 0.1, y - 0.05), 0.2, 0.1, color='skyblue', alpha=0.8, edgecolor='black'))
        ax.text(x, y, labels[node], fontsize=10, ha='center', va='center')

    # 화살표 추가
    arrows = [
        ("start", "step1"),
        ("step1", "step2"),
        ("step2", "step3"),
        ("step3", "step4"),
        ("step3", "step5"),
    ]

    arrow_styles = {
        ("step3", "step4"): (0.3, 0.2),
        ("step3", "step5"): (0.7, 0.2),
    }

    for start, end in arrows:
        x_start, y_start = nodes[start]
        x_end, y_end = nodes[end]
        dx = x_end - x_start
        dy = y_end - y_start

        if (start, end) in arrow_styles:
            x_control, y_control = arrow_styles[(start, end)]
            ax.add_patch(FancyArrow(x_start, y_start, x_control - x_start, y_control - y_start, \
                                    width=0.002, head_width=0.03, length_includes_head=True, color='black'))
            ax.add_patch(FancyArrow(x_control, y_control, x_end - x_control, y_end - y_control, \
                                    width=0.002, head_width=0.03, length_includes_head=True, color='black'))
        else:
            ax.add_patch(FancyArrow(x_start, y_start, dx, dy, width=0.002, head_width=0.03, \
                                    length_includes_head=True, color='black'))

    # 그래프 꾸미기
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')  # 축 숨김

    # 시각화 저장 및 출력
    plt.title("로직 설계 워크플로우")
    plt.tight_layout()
    plt.show()

def draw_function_relationship():
    # 폰트 설정
    plt.rcParams['font.family'] = r'C:\\Windows\\Fonts\\34455.ttf'
    plt.rcParams['axes.unicode_minus'] = False

    # 그림 크기 설정
    fig, ax = plt.subplots(figsize=(12, 10))

    # 노드 위치 정의
    nodes = {
        "main": (0.5, 0.9),
        "loadData": (0.3, 0.75),
        "validateData": (0.7, 0.75),
        "preprocessData": (0.5, 0.6),
        "findOptimalClusters": (0.3, 0.45),
        "performClustering": (0.7, 0.45),
        "calculateTotalDistance": (0.6, 0.3),
        "denormalizeCentroids": (0.8, 0.3),
        "prepareClusterChartData": (0.3, 0.3),
        "saveResults": (0.5, 0.15),
    }

    # 노드 텍스트 정의
    labels = {
        "main": "main()",
        "loadData": "loadData()",
        "validateData": "validateData()",
        "preprocessData": "preprocessData()",
        "findOptimalClusters": "Elbow Method: findOptimalClusters()",
        "performClustering": "performClustering()",
        "calculateTotalDistance": "calculateTotalDistance()",
        "denormalizeCentroids": "denormalizeCentroids()",
        "prepareClusterChartData": "prepareClusterChartData()",
        "saveResults": "saveResults()",
    }

    # 노드 그리기
    for node, (x, y) in nodes.items():
        ax.add_patch(Rectangle((x - 0.1, y - 0.05), 0.2, 0.1, color='lightgreen', alpha=0.8, edgecolor='black'))
        ax.text(x, y, labels[node], fontsize=10, ha='center', va='center')

    # 화살표 추가
    arrows = [
        ("main", "loadData"),
        ("main", "validateData"),
        ("main", "preprocessData"),
        ("preprocessData", "findOptimalClusters"),
        ("preprocessData", "performClustering"),
        ("performClustering", "calculateTotalDistance"),
        ("performClustering", "denormalizeCentroids"),
        ("preprocessData", "prepareClusterChartData"),
        ("main", "saveResults"),
    ]

    for start, end in arrows:
        x_start, y_start = nodes[start]
        x_end, y_end = nodes[end]
        dx = x_end - x_start
        dy = y_end - y_start
        ax.add_patch(FancyArrow(x_start, y_start, dx, dy, width=0.002, head_width=0.03, \
                                length_includes_head=True, color='black'))

    # 그래프 꾸미기
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')  # 축 숨김

    # 시각화 저장 및 출력
    plt.title("주요 함수 관계 시각화")
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    draw_workflow()
    draw_function_relationship()
