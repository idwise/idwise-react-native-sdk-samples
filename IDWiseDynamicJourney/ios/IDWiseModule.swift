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
    ["onJourneyStarted","onJourneyResumed", "onJourneyCancelled" ,"onError", "onJourneyFinished", "onJourneySummary", "onStepCaptured", "onStepResult", "onStepCancelled", "onStepSkipped"]
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
            IDWiseModule.emitter.sendEvent(withName: "onError", body: ["errorCode": error.code, "errorMessage": error.message] as [String : Any])
          }
        }
    
  }
  
  @objc func startDynamicJourney(_ journeyDefinitionId:String,
                          _ referenceNo: String,
                          _ locale: String) {
    if referenceNo.isEmpty {
      DispatchQueue.main.async {
        IDWise.startDynamicJourney(journeyDefinitionId: journeyDefinitionId,
                                   locale: locale,
                                   journeyDelegate: self,
                                   stepDelegate: self)
      }
    } else {
      DispatchQueue.main.async {
        IDWise.startDynamicJourney(journeyDefinitionId: journeyDefinitionId,
                                   referenceNumber: referenceNo,
                                   locale: locale,
                                   journeyDelegate: self,
                                   stepDelegate: self)
      }
    }
  }
  
  @objc func resumeDynamicJourney(_ journeyDefinitionId:String,
                                  _ journeyId: String,
                                  _ locale: String) {
    DispatchQueue.main.async {
      IDWise.resumeDynamicJourney(journeyDefinitionId: journeyDefinitionId, journeyId: journeyId, locale: locale, journeyDelegate: self, stepDelegate: self)
    }
  }
  
  @objc func startStep(_ stepId: String) {
    DispatchQueue.main.async {
      IDWise.startStep(stepId: stepId)
    }
  }
  
  @objc func startStepFromFileUpload(_ stepId: String,
                                     _ data: Data) {
    DispatchQueue.main.async {
      IDWise.startStepFromFileUpload(stepId: stepId, data: data)
    }
  }
  
  @objc func unloadSDK() {
    DispatchQueue.main.async {
      IDWise.unloadSDK()
    }
  }
  
  @objc func getJourneySummary() {
    
    IDWise.getJourneySummary { journeySummary,error in
      if let summary = journeySummary {
        
        // encoding JSON response so react-native can consume it correctly
        var journeyStepSummaries = ""
        var journeyResult = ""
        
        do {
          let encodedStepSummaries = try JSONEncoder().encode(summary.stepSummaries)
          if let jsonString = String(data: encodedStepSummaries,
                                     encoding: .utf8) {
            journeyStepSummaries = jsonString
          }
        
          let encodedJourneyResult = try JSONEncoder().encode(summary.journeyResult)
          if let jsonString = String(data: encodedJourneyResult,
                                     encoding: .utf8) {
            journeyResult = jsonString
          }
          
        } catch {}

        IDWiseModule.emitter.sendEvent(withName: "onJourneySummary", body: ["journeyId": summary.journeyId,
                                                                            "journeyStepSummaries": journeyStepSummaries,
                                                                            "journeyResult": journeyResult,
                                                                            "journeyIsComplete": summary.isCompleted] as [String : Any])
      } else {
        if let err = error {
          IDWiseModule.emitter.sendEvent(withName: "onError", body: ["errorCode": err.code, "errorMessage": err.message] as [String : Any])
        }
      }
      
    }
  }

}

extension IDWiseModule: IDWiseSDKJourneyDelegate {
  @objc func JourneyStarted(journeyID: String) {
    self.journeyID = journeyID
    IDWiseModule.emitter.sendEvent(withName: "onJourneyStarted", body: ["journeyId": journeyID])
    print("Journey started with journey Id : \(journeyID)")
    getJourneySummary()
  }
  
  func onJourneyResumed(journeyID: String) {
    IDWiseModule.emitter.sendEvent(withName: "onJourneyResumed", body: ["journeyId": journeyID])
    print("Journey resumed with journey Id : \(journeyID)")

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
    IDWiseModule.emitter.sendEvent(withName: "onError", body: ["errorCode": error.code, "errorMessage": error.message] as [String : Any])  }
}

extension IDWiseModule: IDWiseSDKStepDelegate {
  func onStepCancelled(stepId: String) {
    IDWiseModule.emitter.sendEvent(withName: "onStepCancelled", body: ["stepId": stepId])
  }
  
  func onStepSkipped(stepId: String) {
    IDWiseModule.emitter.sendEvent(withName: "onStepSkipped", body: ["stepId": stepId])
  }
  
  func onStepCaptured(stepId: Int, capturedImage: UIImage?) {
    IDWiseModule.emitter.sendEvent(withName: "onStepCaptured", body: ["stepId": stepId])
  }
  
  func onStepResult(stepId: Int, stepResult: StepResult?) {
    
    // encoding JSON response so react-native can consume it correctly

    var stepResultObj = ""
    do {
      let encodedStepResult = try JSONEncoder().encode(stepResult)
      if let jsonString = String(data: encodedStepResult,
                                 encoding: .utf8) {
        stepResultObj = jsonString
      }
    } catch {}
    
    IDWiseModule.emitter.sendEvent(withName: "onStepResult", body: ["stepId": stepId,"stepResult": stepResultObj] as [String : Any])
  }
  
  func onStepConfirmed(stepId: String) {
    
  }
  
  
}


