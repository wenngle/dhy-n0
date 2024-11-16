import pandas as pd

def parse(filename: str):
    ''' Parses .csv input file '''
    try:
        df = pd.read_csv(filename)
        print("success")
        print(df.head())
    except:
        exit(1)
    return

if __name__ == '__main__':
    parse("/workspaces/codespaces-blank/working-title/eog-resources/data/Valiant_505H-09_22-09_30.csv")