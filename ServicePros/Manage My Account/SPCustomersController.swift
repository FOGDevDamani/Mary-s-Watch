//
//  SPCustomersController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class SPCustomersController: UIViewController, UITextFieldDelegate {
  
  @IBOutlet weak var spCurrentCustomer: UISwitch!
  @IBOutlet weak var spPastCustomer: UISwitch!
  @IBOutlet weak var spCustomerProspect: UISwitch!
  @IBOutlet weak var spCustomerFirstName: UITextField!
  @IBOutlet weak var spCustomerLastName: UITextField!
  @IBOutlet weak var spCustomerEmail: UITextField!
  @IBOutlet weak var spCustomerAddress: UITextField!
  @IBOutlet weak var spCustomerState: UITextField!
  @IBOutlet weak var spCustomerCity: UITextField!
  @IBOutlet weak var spCustomerZipcode: UITextField!
  @IBOutlet weak var spCustomerCounty: UITextField!
  @IBOutlet weak var spCustomerCellphone: UITextField!
  
  
  override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
      configureTextFields()
      confirgureTapGesture()
    }
  
  
  
  private func confirgureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(SPCustomersController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  private func configureTextFields() {
    spCustomerFirstName.delegate = self
    spCustomerLastName.delegate = self
    spCustomerEmail.delegate = self
    spCustomerAddress.delegate = self
    spCustomerState.delegate = self
    spCustomerCity.delegate = self
    spCustomerZipcode.delegate = self
    spCustomerCounty.delegate = self
    spCustomerCellphone.delegate = self
  }
  
  @IBAction func addSPCustomer(_ sender: Any) {
    
    guard let firstName = spCustomerFirstName.text, spCustomerFirstName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a first name", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let lastName = spCustomerLastName.text, spCustomerLastName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid last name", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let  email = spCustomerEmail.text, spCustomerEmail.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Plase enter a valid meail", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let address = spCustomerAddress.text, spCustomerAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid email", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let state = spCustomerState.text, spCustomerState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid state", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let city = spCustomerCity.text, spCustomerCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid city", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let zipCode = spCustomerZipcode.text, spCustomerZipcode.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid zipcode", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let county = spCustomerCounty.text, spCustomerCounty.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid county", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let cellPhone = spCustomerCellphone.text, spCustomerCellphone.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "please enter a valid cell phone number", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    let newSPCustomer = SPCustomers(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zipCode, county: county)
    
    let spCustomerReference = Firestore.firestore().collection("User").document("Service Provider").collection("MyCustomers")
    
    spCustomerReference.addDocument(data: newSPCustomer.dictionary) { (error) in
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

extension SPCustomersController {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
      if textField == spCustomerFirstName {
        spCustomerLastName.becomeFirstResponder()
      } else if textField == spCustomerLastName{
        spCustomerEmail.becomeFirstResponder()
      } else if textField == spCustomerEmail {
        spCustomerAddress.becomeFirstResponder()
      } else if textField == spCustomerAddress {
        spCustomerState.becomeFirstResponder()
      } else if textField == spCustomerState {
        spCustomerCity.becomeFirstResponder()
      } else if textField == spCustomerCity {
        spCustomerZipcode.becomeFirstResponder()
      } else if textField == spCustomerZipcode {
        spCustomerCounty.becomeFirstResponder()
      } else if textField == spCustomerCounty {
        spCustomerCellphone.becomeFirstResponder()
      } else {
        textField.resignFirstResponder()
      }
      return true
    }
}
