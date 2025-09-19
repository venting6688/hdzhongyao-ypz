/**
 * 订阅消息（支持多模板、多API、多参数）
 * @param {Array<string>} tmplIds 模板ID数组
 * @param {Object|Function} reportApis - 单一函数或 { tmplId: apiFn }
 * @param {Object|Function} reportParams - 单一参数或 { tmplId: (rawData) => params }
 * @param {Object} rawData - 原始数据，用于生成每个模板的参数
 */

function subscribeRegisterNotice(tmplIds = [], reportApis, reportParams = {}, rawData = {}) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(tmplIds) || tmplIds.length === 0) {
      return reject(new Error('请传入至少一个模板ID'))
    }
    
    uni.getSetting({
      withSubscriptions: true,
      success: (settingRes) => {
        // 检查订阅消息总开关
        if (!settingRes.subscriptionsSetting.mainSwitch) {
          // 总开关关闭，引导用户开启
          showGuideToOpenSetting('订阅消息总开关已关闭，需要开启后才能接收重要通知')
            .then(() => {
              reject(new Error('订阅消息总开关未开启'))
            })
            .catch(() => {
              reject(new Error('订阅消息总开关未开启'))
            })
          return
        }
        
        // 检查特定模板的授权状态
        const unauthorizedTmplIds = []
        tmplIds.forEach(tmplId => {
          const authStatus = settingRes.subscriptionsSetting.itemSettings &&
            settingRes.subscriptionsSetting.itemSettings[tmplId]
          
          if (authStatus === 'reject') {
            unauthorizedTmplIds.push(tmplId)
          }
        })
        
        // 如果有被拒绝的模板，先引导用户开启
        if (unauthorizedTmplIds.length > 0) {
          showGuideToOpenSetting('您已拒绝部分消息订阅，需要开启后才能接收重要通知')
            .then(() => {
              // 用户可能已经在设置中更改了授权状态，重新尝试订阅
              requestSubscribeWithReport(tmplIds, reportApis, reportParams, rawData)
                .then(resolve)
                .catch(reject)
            })
            .catch(() => {
              reject(new Error('用户取消授权订阅消息'))
            })
          return
        }
        
        // 正常请求订阅
        requestSubscribeWithReport(tmplIds, reportApis, reportParams, rawData)
          .then(resolve)
          .catch(reject)
      },
      fail: (err) => {
        console.error('获取用户设置失败:', err)
        reject(err)
      }
    })
  })
}

// 引导用户打开设置的辅助函数
function showGuideToOpenSetting(message) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      content: message,
      confirmText: '前往设置',
      cancelText: '暂不开启',
      success: (res) => {
        if (res.confirm) {
          uni.openSetting({
            success: (settingRes) => {
              console.log('设置界面已打开', settingRes)
              resolve()
            },
            fail: (err) => {
              console.error('打开设置失败:', err)
              reject(err)
            }
          })
        } else {
          reject(new Error('用户取消授权'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 提取出的订阅请求和上报逻辑 - 支持多种调用方式
function requestSubscribeWithReport(tmplIds, reportApis, reportParams, rawData) {
  return new Promise((resolve, reject) => {
    wx.requestSubscribeMessage({
      tmplIds,
      success: (subRes) => {
        tmplIds.forEach(id => {
          console.log(`模板 ${id} 结果: ${subRes[id] || '未返回'}`)
        })
        
        const accepted = Object.values(subRes).some(v => v === 'accept')
        const rejected = Object.values(subRes).some(v => v === 'reject')
        
        // 处理多种API调用场景 - 无论用户接受还是拒绝，都执行API调用
        if ((accepted || rejected) && reportApis) {
          // 场景1: 单个API函数
          if (typeof reportApis === 'function') {
            let finalParams = reportParams;
            
            // 如果reportParams是函数，使用rawData生成参数
            if (typeof reportParams === 'function') {
              finalParams = reportParams(rawData);
            }
            
            // 如果有拒绝的模板，设置openid为空
            if (rejected && finalParams && typeof finalParams === 'object') {
              finalParams = {
                ...finalParams,
                openid: ''
              };
            }
            
            reportApis(finalParams)
              .then(response => {
                resolve({ response, subRes, userAction: accepted ? 'accepted' : 'rejected' })
              })
              .catch(err => {
                console.error('API调用失败:', err)
                resolve({ subRes, reportError: err, userAction: accepted ? 'accepted' : 'rejected' })
              })
          } 
          // 场景2: API对象，包含多个API函数
          else if (typeof reportApis === 'object' && reportApis !== null) {
            const promises = [];
            const apiResults = {};
            
            // 遍历所有模板ID，收集需要调用的API
            tmplIds.forEach(tmplId => {
              const status = subRes[tmplId];
              
              // 无论用户接受还是拒绝，都执行API调用
              if ((status === 'accept' || status === 'reject') && typeof reportApis[tmplId] === 'function') {
                // 确定参数
                let paramsForApi = {...rawData};
                
                // 如果reportParams是对象且有对应模板ID的参数
                if (typeof reportParams === 'object' && reportParams !== null && reportParams[tmplId]) {
                  // 如果参数是函数，则执行它
                  if (typeof reportParams[tmplId] === 'function') {
                    paramsForApi = {
                      ...paramsForApi,
                      ...reportParams[tmplId](rawData)
                    };
                  } else {
                    paramsForApi = {
                      ...paramsForApi,
                      ...reportParams[tmplId]
                    };
                  }
                }
                // 如果reportParams是函数
                else if (typeof reportParams === 'function') {
                  paramsForApi = {
                    ...paramsForApi,
                    ...reportParams(rawData)
                  };
                }
                
                // 如果用户拒绝，设置openid为空
                if (status === 'reject') {
                  paramsForApi.openid = '';
                }
                
                // 收集API调用
                promises.push(
                  reportApis[tmplId](paramsForApi)
                    .then(result => {
                      apiResults[tmplId] = {
                        success: true, 
                        result,
                        userAction: status
                      };
                      return apiResults[tmplId];
                    })
                    .catch(error => {
                      apiResults[tmplId] = {
                        success: false, 
                        error,
                        userAction: status
                      };
                      return apiResults[tmplId];
                    })
                );
              }
            });
            
            // 执行所有API调用
            if (promises.length > 0) {
              Promise.all(promises)
                .then(() => {
                  resolve({ 
                    responses: apiResults, 
                    subRes,
                    hasAccepted: accepted,
                    hasRejected: rejected
                  });
                })
                .catch(err => {
                  console.error('API调用失败:', err);
                  resolve({ 
                    responses: apiResults, 
                    subRes, 
                    error: err,
                    hasAccepted: accepted,
                    hasRejected: rejected
                  });
                });
            } else {
              // 没有需要调用的API
              resolve({ 
                subRes,
                hasAccepted: accepted,
                hasRejected: rejected
              });
            }
          } 
          // 场景3: 其他情况
          else {
            resolve({ 
              subRes,
              hasAccepted: accepted,
              hasRejected: rejected
            });
          }
        } else {
          // 没有模板被接受或拒绝，直接返回订阅结果
          resolve({ 
            subRes,
            hasAccepted: accepted,
            hasRejected: false
          });
        }
      },
      fail: (err) => {
        console.error('订阅请求失败:', err)
        
        // 处理用户拒绝并选择"总是保持以上选择"的情况
        if (err.errCode === 20004) {
          showGuideToOpenSetting('您已拒绝接收订阅消息，需要开启后才能接收重要通知')
            .then(() => {
              // 用户可能已经在设置中更改了授权状态，重新尝试订阅
              requestSubscribeWithReport(tmplIds, reportApis, reportParams, rawData)
                .then(resolve)
                .catch(reject)
            })
            .catch(() => {
              // 即使用户取消授权，也执行API调用（openid为空）
              executeApisWithEmptyOpenid(tmplIds, reportApis, reportParams, rawData)
                .then(result => {
                  resolve({
                    ...result,
                    guideCancelled: true,
                    subRes: null
                  })
                })
                .catch(reject)
            })
        } else {
          // 其他错误，也执行API调用（openid为空）
          executeApisWithEmptyOpenid(tmplIds, reportApis, reportParams, rawData)
            .then(result => {
              resolve({
                ...result,
                subscriptionFailed: true,
                subRes: null,
                subscriptionError: err
              })
            })
            .catch(reject)
        }
      }
    })
  })
}

// 辅助函数：在订阅失败时执行API调用（openid为空）
function executeApisWithEmptyOpenid(tmplIds, reportApis, reportParams, rawData) {
  return new Promise((resolve, reject) => {
    if (!reportApis) {
      resolve({ noApisToExecute: true });
      return;
    }
    
    // 单个API函数的情况
    if (typeof reportApis === 'function') {
      let finalParams = reportParams;
      
      if (typeof reportParams === 'function') {
        finalParams = reportParams(rawData);
      }
      
      // 设置openid为空
      if (finalParams && typeof finalParams === 'object') {
        finalParams = {
          ...finalParams,
          openid: ''
        };
      }
      
      reportApis(finalParams)
        .then(response => {
          resolve({ response, userAction: 'subscription_failed' })
        })
        .catch(err => {
          console.error('API调用失败:', err)
          resolve({ reportError: err, userAction: 'subscription_failed' })
        })
    } 
    // API对象的情况
    else if (typeof reportApis === 'object' && reportApis !== null) {
      const promises = [];
      const apiResults = {};
      
      tmplIds.forEach(tmplId => {
        if (typeof reportApis[tmplId] === 'function') {
          let paramsForApi = {...rawData};
          
          // 处理参数
          if (typeof reportParams === 'object' && reportParams !== null && reportParams[tmplId]) {
            if (typeof reportParams[tmplId] === 'function') {
              paramsForApi = {
                ...paramsForApi,
                ...reportParams[tmplId](rawData)
              };
            } else {
              paramsForApi = {
                ...paramsForApi,
                ...reportParams[tmplId]
              };
            }
          } else if (typeof reportParams === 'function') {
            paramsForApi = {
              ...paramsForApi,
              ...reportParams(rawData)
            };
          }
          
          // 设置openid为空
          paramsForApi.openid = '';
          
          promises.push(
            reportApis[tmplId](paramsForApi)
              .then(result => {
                apiResults[tmplId] = {
                  success: true, 
                  result,
                  userAction: 'subscription_failed'
                };
                return apiResults[tmplId];
              })
              .catch(error => {
                apiResults[tmplId] = {
                  success: false, 
                  error,
                  userAction: 'subscription_failed'
                };
                return apiResults[tmplId];
              })
          );
        }
      });
      
      if (promises.length > 0) {
        Promise.all(promises)
          .then(() => {
            resolve({ responses: apiResults })
          })
          .catch(err => {
            console.error('API调用失败:', err);
            resolve({ responses: apiResults, error: err });
          });
      } else {
        resolve({ noApisToExecute: true });
      }
    } else {
      resolve({ noApisToExecute: true });
    }
  });
}

export default {
	subscribeRegisterNotice
}
