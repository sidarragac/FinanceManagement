import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'auth.register.index': { paramsTuple?: []; params?: {} }
    'auth.register.store': { paramsTuple?: []; params?: {} }
    'auth.login.index': { paramsTuple?: []; params?: {} }
    'auth.login.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'accounts.create': { paramsTuple?: []; params?: {} }
    'accounts.store': { paramsTuple?: []; params?: {} }
    'accounts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'auth.register.index': { paramsTuple?: []; params?: {} }
    'auth.login.index': { paramsTuple?: []; params?: {} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'accounts.create': { paramsTuple?: []; params?: {} }
    'accounts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'auth.register.index': { paramsTuple?: []; params?: {} }
    'auth.login.index': { paramsTuple?: []; params?: {} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'accounts.create': { paramsTuple?: []; params?: {} }
    'accounts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.register.store': { paramsTuple?: []; params?: {} }
    'auth.login.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'accounts.store': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'accounts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'accounts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}