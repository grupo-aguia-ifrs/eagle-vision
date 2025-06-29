import sqlite3
import pandas as pd

DATABASE_NAME = r'C:\Users\USER\PycharmProjects\eagle-vision\backend\db.sqlite3'
EXCEL_FILE = r"C:\Users\USER\PycharmProjects\eagle-vision\backend\bancodedados\Dados Águia Vision.xlsx"

def read_excel_data(file_path):
    xls = pd.ExcelFile(file_path)
    sheet_names = xls.sheet_names
    data = {}
    for sheet_name in sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)
        data[sheet_name] = df.to_dict(orient='records')
    return data

def populate_database(db_path, excel_data):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Assuming 'Página1' is the main sheet with client data
    if 'Página1' in excel_data:
        for row in excel_data['Página1']:
            # Insert into cliente_clientemodel
            try:
                cursor.execute(
                    "INSERT INTO cliente_clientemodel (id, nome_fantasia, codigo, telefone_responsavel, nome_responsavel, data_cadastro) VALUES (?, ?, ?, ?, ?, DATE('now'))",
                    (row['id'], row['nome'], f"CLI-{row['id']}", row['telefone_responsavel'], row['nome_responsavel'])
                )
                client_id = row['id']
            except sqlite3.IntegrityError as e:
                print(f"Erro ao inserir cliente {row['nome']}: {e}")
                continue

            # Insert into alarme_alarmemodel
            if row['modelo_central'] != '-' and row['sensores_instalados'] != '-':
                try:
                    cursor.execute(
                        "INSERT INTO alarme_alarmemodel (modelo_central, sensores_instalados, grup_pessoas, data_cadastro, id_cliente_id) VALUES (?, ?, ?, DATE('now'), ?)",
                        (row['modelo_central'], row['sensores_instalados'], row['grup_pessoas'], client_id)
                    )
                except sqlite3.IntegrityError as e:
                    print(f"Erro ao inserir alarme para cliente {row['nome']}: {e}")

            # Insert into monitoramento_cftv
            if row['modelo_cftv'] != '-' and row['ip_cadastro'] != '-' and row['cloud_cftv'] != '-' and row['grup_pessoas.1'] != '-':
                try:
                    cursor.execute(
                        "INSERT INTO monitoramento_cftv (modelo_cftv, ip_externo, cloud_cftv, grup_pessoas, cliente_id, data_cadastro) VALUES (?, ?, ?, ?, ?, DATE('now'))",
                        (row['modelo_cftv'], row['ip_cadastro'], row['cloud_cftv'], row['grup_pessoas.1'], client_id)
                    )
                except sqlite3.IntegrityError as e:
                    print(f"Erro ao inserir CFTV para cliente {row['nome']}: {e}")

            # Insert into cameras_cliente (assuming 'nome' from excel is the client name for cameras_cliente)
            try:
                cursor.execute(
                    "INSERT INTO cameras_cliente (id, nome) VALUES (?, ?)",
                    (client_id, row['nome'])
                )
            except sqlite3.IntegrityError as e:
                print(f"Erro ao inserir cameras_cliente para {row['nome']}: {e}")

            # Insert into cameras_camera
            if row['modelo_cam'] != '-' and row['ip_cam'] != '-' and row['senha'] != '-':
                # Handle multiple IPs if present
                ip_cams = str(row['ip_cam']).split('\n')
                for ip_cam in ip_cams:
                    if ip_cam.strip():
                        try:
                            cursor.execute(
                                "INSERT INTO cameras_camera (modelo_cam, ip_cam, senha, data_cadastro, cftv_id) VALUES (?, ?, ?, DATE('now'), ?)",
                                (row['modelo_cam'], ip_cam.strip(), row['senha'], client_id)
                            )
                        except sqlite3.IntegrityError as e:
                            print(f"Erro ao inserir câmera {ip_cam.strip()} para cliente {row['nome']}: {e}")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    all_excel_data = read_excel_data(EXCEL_FILE)
    populate_database(DATABASE_NAME, all_excel_data)
    print(f"Banco de dados '{DATABASE_NAME}' populado com sucesso!")