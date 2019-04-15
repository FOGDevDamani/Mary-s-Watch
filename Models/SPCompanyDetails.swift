//
//CompanyDetails.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/16/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase

struct CompanyDetails {
  var typeOfCompany: String
  var companyName: String
  var companyAddress: String
  var companyState: String
  var companyCity: String
  var companyZipcode: String
  var companyWebsite: String
  var companyBusinessPhone: String
  var companyEIN: String
  var numberOfEmployees: String
  
  
  var dictionary: [String:Any] {
    return [
      "Type of Company": typeOfCompany,
      "Company Name": companyName,
      "Company Address": companyAddress,
      "Company State": companyState,
      "Company City": companyCity,
      "Company Zipcode": companyZipcode,
      "Company Website": companyWebsite,
      "Company Business Phonenumber": companyBusinessPhone,
      "Company EIN": companyEIN,
      "Number of Employees": numberOfEmployees
    ]
  }
}

extension CompanyDetails: DocumentSerializable {
  init?(dictionary: [String : Any]) {
    guard let typeOfCompany = dictionary["Type of Company"] as? String,
    let companyName = dictionary["Company Name"] as? String,
    let companyAddress = dictionary["Company Address"] as? String,
    let companyState = dictionary["Company State"] as? String,
    let companyCity = dictionary["Company City"] as? String,
    let companyZipcode = dictionary["Company Zipcode"] as? String,
    let companyWebsite = dictionary["Company Website"] as? String,
    let companyBusinessPhone = dictionary["Company Business Phonenumber"] as? String,
    let companyEIN = dictionary["Company EIN"] as? String,
    let numberOfEmployees = dictionary["Number of Employees"] as? String else {return nil}
    
    self.init(typeOfCompany: typeOfCompany, companyName: companyName, companyAddress: companyAddress, companyState: companyState, companyCity: companyCity, companyZipcode: companyZipcode, companyWebsite: companyWebsite, companyBusinessPhone: companyBusinessPhone, companyEIN: companyEIN, numberOfEmployees: numberOfEmployees)
  }
}
