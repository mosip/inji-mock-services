
## Properties file
set -e
properties_file="$1"
echo `date "+%m/%d/%Y %H:%M:%S"` ": $properties_file"
if [ -f "$properties_file" ]
then
     echo `date "+%m/%d/%Y %H:%M:%S"` ": Property file \"$properties_file\" found."
    while IFS='=' read -r key value
    do
        key=$(echo $key | tr '.' '_')
         eval ${key}=\${value}
    done < "$properties_file"
else
     echo `date "+%m/%d/%Y %H:%M:%S"` ": Property file not found, Pass property file name as argument."
fi

## Check if inji_certify database exists
echo "Checking if database '$MOSIP_DB_NAME' exists..."
RESULT=$(PGPASSWORD=$SU_USER_PWD psql -U "$SU_USER" -h "$DB_SERVERIP" -p "$DB_PORT" -tAc "SELECT 1 FROM pg_database WHERE datname='$MOSIP_DB_NAME'")
if [ "$RESULT" = "1" ]; then
  echo "Database '$MOSIP_DB_NAME' already exists, exicuting ddl scripts."
else
  echo "inji_certify database was not found."
  exit 0
fi

## Create Truckpass table
PGPASSWORD=$SU_USER_PWD psql -v ON_ERROR_STOP=1 --username=$SU_USER --host=$DB_SERVERIP --port=$DB_PORT --dbname=$DEFAULT_DB_NAME -f ddl.sql
