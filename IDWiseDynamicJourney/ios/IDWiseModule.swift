//
//  IDWiseSDKBridge.swift
//  idwiseReactNativeSample
//
//  Created by Hafiz Ahsan on 14/04/2022.
//

import Foundation
import IDWise
import React

@objc (IDWiseModule)
class IDWiseModule: RCTEventEmitter  {
  
  var journeyID = ""
  
  public static var emitter: RCTEventEmitter!
  
  open override func supportedEvents() -> [String] {
     ["journeyStarted", "journeyCancelled" ,"onError", "journeyCompleted"]
   }
  
  override init() {
    super.init()
    IDWiseModule.emitter = self
  }
  @objc func initializeSDK(_ clientKey: String) {
    
    IDWise.initialize(clientKey: clientKey) { err in
          if let error = err {
            print(error.message)
          }
        }
    
  }
  
  @objc func startJourney(_ journeyDefinitionID:String,
                          _ referenceNo: String,
                          _ locale: String) {
    if referenceNo.isEmpty {
      DispatchQueue.main.async {
        IDWise.startJourney(journeyDefinitionId: journeyDefinitionID,locale: locale, journeyDelegate: self)
      }
    } else {
      DispatchQueue.main.async {
        IDWise.startJourney(journeyDefinitionId: journeyDefinitionID,referenceNumber: referenceNo,locale: locale, journeyDelegate: self)
      }
    }
  }
  
  // Delegate Methods bridging
  @objc func journeyStarted(_ callback: RCTResponseSenderBlock) {
    
  }
  
}

extension IDWiseModule: IDWiseSDKJourneyDelegate {
  @objc func JourneyStarted(journeyID: String) {
    self.journeyID = journeyID
    IDWiseModule.emitter.sendEvent(withName: "journeyStarted", body: ["journeyId": journeyID])
    print("Journey started with journey Id : \(journeyID)")
  }
  
  func onJourneyResumed(journeyID: String) {
    
  }
  
  func JourneyFinished() {
    IDWiseModule.emitter.sendEvent(withName: "journeyCompleted", body: ["journeyId": self.journeyID])
    print("Journey Finished")
  }
  
  func JourneyCancelled() {
    print("Journey Cancelled")
    IDWiseModule.emitter.sendEvent(withName: "journeyCancelled", body: ["journeyId": self.journeyID])

  }
  
  func onError(error: IDWiseSDKError) {
    IDWiseModule.emitter.sendEvent(withName: "onError", body: ["errorCode": error.code, "errorMessage": error.message])
  }
  
  
}

