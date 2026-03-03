import sqlite3
import sys

def export_db(db_path, output_path):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row['name'] for row in cursor.fetchall() if row['name'] != 'sqlite_sequence']
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('-- Exported from SQLite to MySQL\n\n')
        f.write('SET FOREIGN_KEY_CHECKS=0;\n\n')
        
        for table in tables:
            # We don't want Drizzle migrations table dumped as INSERTs
            if table == '__drizzle_migrations':
                continue

            cursor.execute(f"SELECT * FROM `{table}`")
            rows = cursor.fetchall()
            if not rows:
                continue
            
            f.write(f'-- Data for table `{table}`\n')
            
            for row in rows:
                columns = []
                values = []
                for key in row.keys():
                    columns.append(f'`{key}`')
                    val = row[key]
                    if val is None:
                        values.append('NULL')
                    elif isinstance(val, (int, float)):
                        values.append(str(val))
                    else:
                        # Escape quotes and backslashes for MySQL
                        val_str = str(val).replace('\\', '\\\\').replace("'", "''")
                        values.append(f"'{val_str}'")
                
                cols_str = ', '.join(columns)
                vals_str = ', '.join(values)
                f.write(f"INSERT INTO `{table}` ({cols_str}) VALUES ({vals_str});\n")
            
            f.write('\n')
        
        f.write('SET FOREIGN_KEY_CHECKS=1;\n')
            
    conn.close()
    print(f"Export successful. Data saved to {output_path}")

if __name__ == '__main__':
    export_db('sqlite.db', 'sqlite_to_mysql_dump.sql')
