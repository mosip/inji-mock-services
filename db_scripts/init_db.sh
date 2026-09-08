#!/bin/sh
# Script to initialize certify DB.
## Usage: ./init_db.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=truckpass-usecase
CHART_VERSION=0.0.1-develop

helm repo add mosip https://mosip.github.io/mosip-helm
helm repo update

while true; do
    read -p "CAUTION: Do we already have Postgres installed? Also make sure that this script will add tables related to truckpass-usecase in certify DB. Do you still want to continue?" yn
    if [ $yn = "Y" ]
      then
        DB_USER_PASSWORD=$( kubectl -n postgres get secrets db-common-secrets -o jsonpath={.data.db-dbuser-password} | base64 -d )

        kubectl create ns $NS

        echo Removing existing inji_certify DB installation
        helm -n $NS delete postgres-init-truckpass

        echo Copy Postgres secrets
        UTIL_URL=https://raw.githubusercontent.com/mosip/mosip-infra/master/deployment/v3/utils/copy_cm_func.sh
        COPY_UTIL=./copy_cm_func.sh

        wget -q $UTIL_URL -O copy_cm_func.sh && chmod +x copy_cm_func.sh

        $COPY_UTIL secret postgres-postgresql postgres $NS

        echo Delete existing DB common secrets
        kubectl -n $NS delete secret db-common-secrets

        echo Initializing DB
        helm -n $NS install postgres-init-truckpass mosip/postgres-init -f init_values.yaml \
        --version $CHART_VERSION \
        --set dbUserPasswords.dbuserPassword="$DB_USER_PASSWORD" \
        --wait --wait-for-jobs
        break
      else
        break
    fi
done
