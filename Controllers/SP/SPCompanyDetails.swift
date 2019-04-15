//
//  SPCompanyDetailsController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/16/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class SPCompanyDetailController: UIViewController, UITextFieldDelegate {
  
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
  
  var selectedState: String?
  let spCompanyDetailController = MWSPCompanyDetailsController()
  
  let states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
  
  @IBOutlet weak var spCompanyDetailsScrollView: UIScrollView!
  
  
  override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    configureTapGesture()
    configureTextFields()
    createToolBar()
    createStatePicker()
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillHideNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
    }
  
  deinit {
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillHideNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
  }
  
  func createStatePicker() {
    let statePicker = UIPickerView()
    statePicker.delegate = self
    
    spCompanyState.inputView = statePicker
    
  }
  
  func createToolBar() {
    let toolBar = UIToolbar()
    toolBar.sizeToFit()
    
    let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(SPCompanyDetailController.handleTap))
    
    toolBar.setItems([doneButton], animated: false)
    toolBar.isUserInteractionEnabled = true
    
    spCompanyState.inputAccessoryView = toolBar
  }
  
  func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(SPCompanyDetailController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  @objc func keyboardWillChange(notification: Notification) {
    guard let keyboardRect = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue else {
      return
    }
    
    let keyboardViewEndFrame = view.convert(keyboardRect, to: view.window)
    
    if notification.name == UIResponder.keyboardWillShowNotification || notification.name == UIResponder
      .keyboardWillChangeFrameNotification {
      spCompanyDetailsScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
    } else {
      spCompanyDetailsScrollView.contentInset = UIEdgeInsets.zero
    }
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
    
    spCompanyDetailController.createNewCompanyDetails(typeOfCompany: typeOfCompany, companyName: companyName, companyAddress: companyAddress, companyState: companyState, companyCity: companyCity, companyZipcode: companyZipcode, companyWebsite: companyWebsite, companyBusinessPhone: companyBusinessPhone, companyEIN: companyEIN, numberOfEmployees: numberOfEmployees)
    
    showAlert(title: "Company Details Successfully Updated", message: "Your company's information has successfully been updated in our system", style: .alert, handler: dismissController)
    
    
    
  }
  
  
  
}

extension SPCompanyDetailController: UIPickerViewDelegate, UIPickerViewDataSource {
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
  
  func numberOfComponents(in pickerView: UIPickerView) -> Int {
    return 1
  }
  
  func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
    return states.count
  }
  
  func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
    return states[row]
  }
  
  func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
    selectedState = states[row]
    spCompanyState.text = selectedState
  }
  
  func showAlert(title: String, message: String, style: UIAlertController.Style = .alert, handler: ((UIAlertAction) -> Void)?) {
    let alertController = UIAlertController(title: title, message: message, preferredStyle: style)
    let okAction = UIAlertAction(title: "OK", style: .default, handler: handler)
    alertController.addAction(okAction)
    
    present(alertController, animated: true, completion: nil)
  }
  
  func dismissController(sender: UIAlertAction) -> Void {
    self.dismiss(animated: true, completion: nil)
  }
  

}
