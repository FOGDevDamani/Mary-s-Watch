//
//  SPController.swift
//  MarysWatch
//
//  Created by Damani Turner on 3/1/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase
import FirebaseFirestore

class MWSPController: UIViewController {
  
  var spAuth = Auth.auth()
  var newSPReference = Firestore.firestore().collection("User").document("Service Provider")
  
  
  
  func createNewSP(withEmail email: String, password: String) {
    spAuth.createUser(withEmail: email, password: password) { (newSP, error) in
      if let error = error {
          print(error.localizedDescription)
      }
      self.sendVerificationEmail()
    }
  }
  
  func resendEmailVerification() {
      self.sendVerificationEmail()
  }
  
  func loginSP(withEmail email: String, password: String) {
    spAuth.signIn(withEmail: email, password: password) { (spUser, error) in
      if let error = error {
        print(error.localizedDescription)
      }
      print("login successful")
    }
  }
  
  
  
  
  
  func createSPData(typeOfCompany: String, firstName: String, lastName: String, email: String, cellPhone: String, address: String, state: String, city: String, zip: String, county: String, userName: String, password: String){
    
    let newSP = ServiceProvider(typeOfCompany: typeOfCompany, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: userName, password: password)
    
    
    newSPReference.setData(newSP.dictionary) { (error) in
      if let error = error {
        print(error.localizedDescription)
        
      }
      
      print("SP successfully added")
    }
  }
  
  func sendVerificationEmail() {
    spAuth.currentUser?.sendEmailVerification(completion: { (error) in
      if let error = error {
        print(error.localizedDescription)
        
      }
      print("Verfication sent to email")
    })
  }
  
  
}



