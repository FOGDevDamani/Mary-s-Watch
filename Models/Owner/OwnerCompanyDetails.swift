//
//  OwnerCompanyDetails.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/16/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase

struct OwnerCompanyDetails {
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

extension OwnerCompanyDetails: DocumentSerializable {
  init?(dictionary: [String : Any]) {
    guard let ownerTypeOfCompany = dictionary["Type of Company"] as? String,
      let ownerCompanyName = dictionary["Company Name"] as? String,
      let ownerCompanyAddress = dictionary["Company Address"] as? String,
      let ownerCompanyState = dictionary["Company State"] as? String,
      let ownerCompanyCity = dictionary["Company City"] as? String,
      let ownerCompanyZipcode = dictionary["Company Zipcode"] as? String,
      let ownerCompanyWebsite = dictionary["Company Website"] as? String,
      let ownerCompanyBusinessPhone = dictionary["Company Business Phonenumber"] as? String,
      let ownerCompanyEIN = dictionary["Company EIN"] as? String,
      let ownerNumberOfEmployees = dictionary["Number of Employees"] as? String else {return nil}
    
    self.init(typeOfCompany: ownerTypeOfCompany, companyName: ownerCompanyName, companyAddress: ownerCompanyAddress, companyState: ownerCompanyState, companyCity: ownerCompanyCity, companyZipcode: ownerCompanyZipcode, companyWebsite: ownerCompanyWebsite, companyBusinessPhone: ownerCompanyBusinessPhone, companyEIN: ownerCompanyEIN, numberOfEmployees: ownerNumberOfEmployees)
  }
}
