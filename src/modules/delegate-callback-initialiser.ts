export const DelegateCallbackModule = {
  $type: DelegateCallbackInitialiser,
  $inject: [],
  $name: 'DelegateCallback'
}

function DelegateCallbackInitialiser(delegateErrorCallback: Function): any {
  return function loggedCallback(fn: Function, context: object | Function) {
    return loggedCallback;

    function loggedCallback(e) {
      try {
        return fn.call(context, e);
      }
      catch (e) {
        delegateErrorCallback(e);
      }
    }
  }
}
