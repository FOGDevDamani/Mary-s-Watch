//
//  MWSPCompanyDetailsController.swift
//  MarysWatch
//
//  Created by Damani Turner on 3/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase
import FirebaseFirestore

class MWSPCompanyDetailsController {
  
  var spCompanyDetailsAuth = Auth.auth()
  var newspCompanyDetailsReference = Firestore.firestore().collection("User").document("Service Provider").collection("CompanyDetails")
  
  func createNewCompanyDetails(typeOfCompany: String, companyName: String, companyAddress: String, companyState: String, companyCity: String, companyZipcode: String, companyWebsite: String, companyBusinessPhone: String, companyEIN: String, numberOfEmployees: String) {
    
    let newCompanyDetails = SPCompanyDetails(typeOfCompany: typeOfCompany, companyName: companyName, companyAddress: companyAddress, companyState: companyState, companyCity: companyCity, companyZipcode: companyZipcode, companyWebsite: companyWebsite, companyBusinessPhone: companyBusinessPhone, companyEIN: companyEIN, numberOfEmployees: numberOfEmployees)
    
    newspCompanyDetailsReference.addDocument(data: newCompanyDetails.dictionary) { (error) in
      if let error = error {
        print(error.localizedDescription)
        
      }
      
      print("SP Company Details successfully added")
    }
  }
  
  
  
  
  
  
}
