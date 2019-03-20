//
//  RenterController.swift
//  MarysWatch
//
//  Created by Damani Turner on 3/1/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase
import FirebaseFirestore

class MWRenterController: UIViewController {
  var renterAuth = Auth.auth()
  var newRenterReference = Firestore.firestore().collection("User").document("Renter")
  
  func createNewRenter(email: String, password: String) {
    renterAuth.createUser(withEmail: email, password: password) { (renter, error) in
      if let error = error {
        print(error.localizedDescription)
     
      }
      self.sendVerificationEmail()
    }
  }
  
  func resendEmailVerification() {
    self.sendVerificationEmail()
  }
  
  func loginRenter(withEmail email: String, password: String) {
    renterAuth.signIn(withEmail: email, password: password) { (spUser, error) in
      if let error = error {
        print(error.localizedDescription)
      }
     print("login successful")
    }
  }
  
  func createRenterData(firstName: String, lastName: String, email: String, cellPhone: String, address: String, state: String, city: String, zip: String, county: String, userName: String, password: String){
    
    let newRenter = Renter(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: userName, password: password)
    
    
    newRenterReference.setData(newRenter.dictionary) { (error) in
      if let error = error {
        print(error.localizedDescription)
      }
      print("Renter successfully added")
    }
  }
  
  func sendVerificationEmail() {
    renterAuth.currentUser?.sendEmailVerification(completion: { (error) in
      if let error = error {
        print(error.localizedDescription)
      }
      print("Verfication sent to email")
    })
  }
  
}


