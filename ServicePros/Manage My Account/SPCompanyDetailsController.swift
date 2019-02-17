//
//  SPCompanyDetailsController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/16/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class SPCompanyDetailsController: UIViewController, UITextFieldDelegate {
  
  
  @IBOutlet weak var spTypeOfCompany: UITextField!
  @IBOutlet weak var spCompanyName: UITextField!
  @IBOutlet weak var spCompanyAddress: UITextField!
  @IBOutlet weak var spCompanyState: UITextField!
  @IBOutlet weak var spCompanyCity: UITextField!
  @IBOutlet weak var spCompanyZipcode: UITextField!
  @IBOutlet weak var spCompanyWebsite: UITextField!
  @IBOutlet weak var spCompanyBusinessPhone: UITextField!
  @IBOutlet weak var spCompanyEIN: UITextField!
  @IBOutlet weak var spNumberOfEmployees: UITextField!
  
  override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    configureTapGesture()
    configureTextFields()
    }
  
  func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(SPCompanyDetailsController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  func configureTextFields() {
    spTypeOfCompany.delegate = self
    spCompanyName.delegate = self
    spCompanyAddress.delegate = self
    spCompanyCity.delegate = self
    spCompanyZipcode.delegate = self
    spCompanyWebsite.delegate = self
    spCompanyBusinessPhone.delegate = self
    spCompanyEIN.delegate = self
    spNumberOfEmployees.delegate = self
  }
    

  @IBAction func spDismissCompanyDetails(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  

  @IBAction func submitSPCompanyDetails(_ sender: Any) {
    guard let typeOfCompany = spTypeOfCompany.text, spTypeOfCompany.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let companyName = spCompanyName.text, spCompanyName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return}
    
    guard let companyAddress = spCompanyAddress.text, spCompanyAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let companyCity = spCompanyCity.text, spCompanyCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let companyState = spCompanyState.text, spCompanyState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    
    guard let companyZipcode = spCompanyZipcode.text, spCompanyZipcode.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    
    guard let companyWebsite = spCompanyWebsite.text, spCompanyWebsite.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
    fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
    self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
    return  }
    
    guard let companyBusinessPhone = spCompanyBusinessPhone.text, spCompanyBusinessPhone.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let companyEIN = spCompanyEIN.text, spCompanyEIN.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let numberOfEmployees = spNumberOfEmployees.text, spNumberOfEmployees.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    let newCompanyDetailsEdit = SPCompanyDetails(typeOfCompany: typeOfCompany, companyName: companyName, companyAddress: companyAddress, companyState: companyState, companyCity: companyCity, companyZipcode: companyZipcode, companyWebsite: companyWebsite, companyBusinessPhone: companyBusinessPhone, companyEIN: companyEIN, numberOfEmployees: numberOfEmployees)
    
    let spCompanyDetailsReference = Firestore.firestore().collection("User").document("Service Provider").collection("CompanyDetails")
    
    spCompanyDetailsReference.addDocument(data: newCompanyDetailsEdit.dictionary) { (error) in
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
  
  
  
}

extension SPCompanyDetailsController {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == spTypeOfCompany {
      spCompanyName.becomeFirstResponder()
    } else if textField == spCompanyName {
      spCompanyAddress.becomeFirstResponder()
    } else if textField == spCompanyAddress {
      spCompanyCity.becomeFirstResponder()
    } else if textField == spCompanyCity {
      spCompanyZipcode.becomeFirstResponder()
    } else if textField == spCompanyZipcode {
      spCompanyWebsite.becomeFirstResponder()
    } else if textField == spCompanyWebsite {
      spCompanyBusinessPhone.becomeFirstResponder()
    } else if textField == spCompanyBusinessPhone {
      spCompanyEIN.becomeFirstResponder()
    } else if textField == spCompanyEIN {
      spNumberOfEmployees.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }

}
