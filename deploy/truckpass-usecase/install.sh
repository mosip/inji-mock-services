#!/bin/bash
# Installs the Truckpass-usecase
# Make sure you have updated ui_values.yaml
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=truckpass-usecase
CHART_VERSION=0.0.1-develop

echo Create $NS namespace
kubectl create ns $NS

function installing_truckpass-usecase() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite
  helm repo update

  UTIL_URL=https://raw.githubusercontent.com/mosip/mosip-infra/master/deployment/v3/utils/copy_cm_func.sh
  COPY_UTIL=./copy_cm_func.sh

  wget -q $UTIL_URL -O copy_cm_func.sh && chmod +x copy_cm_func.sh

  echo Copy secrets for Truckpass-usecase
  $COPY_UTIL secret db-common-secrets postgres $NS

  read -p "Please enter the TRUCKPASS_USECASE_HOST : " truckpass_usecase_host
  if [ -z "$truckpass_usecase_host" ]; then
     echo "ERROR: truckpass_usecase_host cannot be empty; EXITING;";
     exit 1;
  fi

  API_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-api-internal-host})

  echo Installing Truckpass-usecase. Will wait till service gets installed.
  helm -n $NS install truckpass-usecase /home/techno-408/IdeaProjects/inji-mock-services/helm/truckpass-usecase --set image.repository=mohanraj209/inji-usecase --set image.tag=truckpass --set istio.corsPolicy.allowOrigins\[0\].prefix=https://$truckpass_usecase_host --wait --version $CHART_VERSION -f override-values.yaml

  echo Installing Truckpass-UI. Will wait till the UI gets installed.
  helm -n $NS install truckpass-ui /home/techno-408/IdeaProjects/inji-mock-services/helm/truckpass-ui --set image.repository=mohanraj209/truckpass-ui --set image.tag=truckpass --set truckpass.apiUrl=https://$API_HOST/v1/ --set istio.hosts\[0\]=$truckpass_usecase_host --version $CHART_VERSION

  kubectl -n $NS  get deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed truckpass-usecase and truckpass-ui.

  echo "Truckpass portal URL: https://$truckpass_ui_host/admin-ui/"
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_truckpass-usecase   # calling function
