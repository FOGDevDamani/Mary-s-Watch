//
//  OwnerController.swift
//  MarysWatch
//
//  Created by Damani Turner on 3/1/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase
import FirebaseFirestore


class MWOwnerController: UIViewController {
  var ownerAuth = Auth.auth()
  var newOwnerReference = Firestore.firestore().collection("User").document("Owner")
  
  func createNewOwner(email: String, password: String) {
    ownerAuth.createUser(withEmail: email, password: password) { (newOwner, error) in
      if let error = error {
        print(error.localizedDescription)
      }
      self.sendVerificationEmail()
    }
  }
  
  func resendEmailVerification() {
    self.sendVerificationEmail()
  }
  
  func loginOwner(email: String, password: String) {
    ownerAuth.signIn(withEmail: email, password: password) { (owner, error) in
      if let error = error {
        print(error.localizedDescription)
       
      }
      print("login successful")
    }
  }
  
  
  func createOwnerData(typeOfOwner: String, firstName: String, lastName: String, email: String, cellPhone: String, address: String, state: String, city: String, zip: String, county: String, userName: String, password: String) {
	let newOwner = Owner(typeOfOwner: typeOfOwner, firstName: firstName, lastName: lastName, email: email, cellphone: cellPhone, address: address, state: state, city: city, zipcode: zip, county: county, username: userName, password: password)
    
    newOwnerReference.setData(newOwner.dictionary) { (error) in
      
      if let error = error {
        print(error.localizedDescription)
      }
      
      print("Owner successfully added")
    }
  }
  
  func sendVerificationEmail() {
    ownerAuth.currentUser?.sendEmailVerification(completion: { (error) in
      if let error = error {
        print(error.localizedDescription)
        
      }
      print("Verfication sent to email")
    })
  }
  
}


