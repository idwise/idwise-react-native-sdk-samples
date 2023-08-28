//
//  IDWiseSDKBridge.swift
//  idwiseReactNativeSample
//
//  Created by Hafiz Ahsan on 14/04/2022.
//

import Foundation
import IDWiseSDK
import React

@objc (IDWiseModule)
class IDWiseModule: RCTEventEmitter  {
  
  var journeyID = ""
  
  public static var emitter: RCTEventEmitter!
  
  open override func supportedEvents() -> [String] {
     ["onJourneyStarted", "onJourneyCancelled" ,"onError", "onJourneyFinished"]
   }
  
  override init() {
    super.init()
    IDWiseModule.emitter = self
  }
  @objc func initialize(_ clientKey: String,_ theme: String) {
    var sdkTheme: IDWiseSDKTheme = .systemDefault
    if theme == "LIGHT" {
      sdkTheme = .light
    } else if theme == "DARK" {
      sdkTheme = .dark
    }
    IDWise.initialize(clientKey: clientKey,theme: sdkTheme) { err in
          if let error = err {
            IDWiseModule.emitter.sendEvent(withName: "onError", body: ["errorCode": error.code, "message": error.message] as [String : Any])
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
  
  
}

extension IDWiseModule: IDWiseSDKJourneyDelegate {
  @objc func JourneyStarted(journeyID: String) {
    self.journeyID = journeyID
    IDWiseModule.emitter.sendEvent(withName: "onJourneyStarted", body: ["journeyId": journeyID])
    print("Journey started with journey Id : \(journeyID)")
  }
  
  func onJourneyResumed(journeyID: String) {
    
  }
  
  func JourneyFinished() {
    IDWiseModule.emitter.sendEvent(withName: "onJourneyFinished", body: ["journeyId": self.journeyID])
    print("Journey Finished")
  }
  
  func JourneyCancelled() {
    print("Journey Cancelled")
    IDWiseModule.emitter.sendEvent(withName: "onJourneyCancelled", body: ["journeyId": self.journeyID])

  }
  
  func onError(error: IDWiseSDKError) {
    IDWiseModule.emitter.sendEvent(withName: "onError", body: ["errorCode": error.code, "message": error.message] as [String : Any])
  }
  
  
}

