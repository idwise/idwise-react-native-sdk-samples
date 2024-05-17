//
//  RCTIDWise.m
//  idwiseReactNativeSample
//
//  Created by Hafiz Ahsan on 14/04/2022.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(IDWiseModule,RCTEventEmitter)

RCT_EXTERN_METHOD(initialize:(NSString *)clientKey
                  :(NSString *)theme)
RCT_EXTERN_METHOD(startDynamicJourney:(NSString *)journeyDefinitionId
                  :(NSString *)referenceNo
                  :(NSString *)locale)
RCT_EXTERN_METHOD(resumeDynamicJourney:(NSString *)journeyDefinitionId
                  :(NSString *)journeyId
                  :(NSString *)locale)
RCT_EXTERN_METHOD(getJourneySummary
                 )
RCT_EXTERN_METHOD(startStep:(NSString *)stepId
                 )
RCT_EXTERN_METHOD(startStepFromFileUpload:(NSString *)stepId
                  :(NSData *)data
                 )
RCT_EXTERN_METHOD(unloadSDK
                  )
RCT_EXTERN_METHOD(supportedEvents)
@end
