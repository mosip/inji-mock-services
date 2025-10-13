#!/bin/bash
# Installs the Inji-usecase
# Make sure you have updated ui_values.yaml
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=inji-usecase
CHART_VERSION=0.0.1-develop
COPY_UTIL=../copy_cm_func.sh

echo Create $NS namespace
kubectl create ns $NS

function installing_inji-usecase() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite
  helm repo update

  echo Copy configmaps for Inji-usecase
  $COPY_UTIL configmap keycloak-host keycloak $NS

  INJI_USECASE_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-inji-usecase-host})
  API_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-api-internal-host})

  echo Installing Inji-usecase. Will wait till service gets installed.
  helm -n $NS install inji-usecase mosip/inji-usecase --set istio.corsPolicy.allowOrigins\[0\].prefix=https://$ADMIN_HOST --wait --version $CHART_VERSION

  kubectl -n $NS  get deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed inji-usecase

  echo "Truckpass portal URL: https://$ADMIN_HOST/admin-ui/"
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_inji-usecase   # calling function
