//
//  CompanyDetailsController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/10/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase


class CompanyDetailsController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var ownerTypeOfCompany: UITextField!
    @IBOutlet weak var ownerCompanyName: UITextField!
    @IBOutlet weak var ownerCompanyAddress: UITextField!
    @IBOutlet weak var ownerCompanyState: UITextField!
    @IBOutlet weak var ownerCompanyCity: UITextField!
    @IBOutlet weak var ownerCompanyZipcode: UITextField!
    @IBOutlet weak var ownerCompanyWebsite: UITextField!
    @IBOutlet weak var ownerBusinessPhone: UITextField!
    @IBOutlet weak var ownerEIN: UITextField!
    @IBOutlet weak var ownerNumberOfEmployees: UITextField!
    
    
    
  @IBAction func dismissOwnerCompanyDetails(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
    
    override func viewDidLoad() {
        super.viewDidLoad()
      configureTextFields()
      configureTapGesture()
    }

  
  func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(CompanyDetailsController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  func configureTextFields() {
    ownerTypeOfCompany.delegate = self
    ownerCompanyName.delegate = self
    ownerCompanyAddress.delegate = self
    ownerCompanyCity.delegate = self
    ownerCompanyZipcode.delegate = self
    ownerCompanyWebsite.delegate = self
    ownerBusinessPhone.delegate = self
    ownerEIN.delegate = self
    ownerNumberOfEmployees.delegate = self
  }
  
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
  
  @IBAction func updateOwnerCompanyDetails(_ sender: Any) {
    guard let typeOfCompany = ownerTypeOfCompany.text, ownerTypeOfCompany.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
  
    guard let companyName = ownerCompanyName.text, ownerCompanyName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let companyAddress = ownerCompanyAddress.text, ownerCompanyAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let companyState = ownerCompanyState.text,
      ownerCompanyState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
    
    guard let companyCity = ownerCompanyCity.text, ownerCompanyCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let companyZipcode = ownerCompanyZipcode.text, ownerCompanyZipcode.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    
    guard let companyWebsite = ownerCompanyWebsite.text, ownerCompanyWebsite.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    
    guard let companyBusinessPhone = ownerBusinessPhone.text, ownerBusinessPhone.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let companyEIN = ownerEIN.text, ownerEIN.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let numberOfEmployees = ownerNumberOfEmployees.text, ownerNumberOfEmployees.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "TownerBusinessPhonet not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    let newOwnerCompanyDetailsEdit = OwnerCompanyDetails(typeOfCompany: typeOfCompany, companyName: companyName, companyAddress: companyAddress, companyState: companyState, companyCity: companyCity, companyZipcode: companyZipcode, companyWebsite: companyWebsite, companyBusinessPhone: companyBusinessPhone, companyEIN: companyEIN, numberOfEmployees: numberOfEmployees )
    
    let ownerCompanyDetailsReference = Firestore.firestore().collection("User").document("Owner").collection("CompanyDetails")
    
   
    ownerCompanyDetailsReference.addDocument(data: newOwnerCompanyDetailsEdit.dictionary) { (error) in
      
      if let error = error {
        print("Error creating customer: \(error.localizedDescription)")
      } else {
        print("Customer Successfully created")
      }
    }
    
    let customerCreatedAlert = UIAlertController(title: "Your Customer Invited", message: "Invitation to join your customer has been sent", preferredStyle: .alert)
    customerCreatedAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
      self.dismiss(animated: true, completion: nil)
    }))
    self.present(customerCreatedAlert, animated: true, completion: nil)
    
  }
    
  
  
  
  
  
  @IBAction func dismissCompanyDetails(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  

    
    

  
}

extension CompanyDetailsController {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == ownerTypeOfCompany {
      ownerCompanyName.becomeFirstResponder()
    } else if textField == ownerCompanyName {
      ownerCompanyAddress.becomeFirstResponder()
    } else if textField == ownerCompanyAddress {
      ownerCompanyCity.becomeFirstResponder()
    } else if textField == ownerCompanyCity {
      ownerCompanyZipcode.becomeFirstResponder()
    } else if textField == ownerCompanyZipcode {
      ownerCompanyWebsite.becomeFirstResponder()
    } else if textField == ownerCompanyWebsite {
      ownerBusinessPhone.becomeFirstResponder()
    } else if textField == ownerBusinessPhone {
      ownerEIN.becomeFirstResponder()
    } else if textField == ownerEIN {
      ownerNumberOfEmployees.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }
}
