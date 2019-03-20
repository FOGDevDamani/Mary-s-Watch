//
//  SPSignUpController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/8/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase


class SPSignUpController: UIViewController, UITextFieldDelegate {

  @IBOutlet weak var spCreateAccountTypeOfCompany: UITextField!
  @IBOutlet weak var spCreateAccountFirstName: UITextField!
  @IBOutlet weak var spCreateAccountLastName: UITextField!
  @IBOutlet weak var spCreateAccountEmail: UITextField!
  @IBOutlet weak var spCreateAccountCellPhone: UITextField!
  @IBOutlet weak var spCreateAccountAddress: UITextField!
  @IBOutlet weak var spCreateAccountState: UITextField!
  @IBOutlet weak var spCreateAccountCity: UITextField!
  @IBOutlet weak var spCreateAccountZip: UITextField!
  @IBOutlet weak var spCreateAccountCounty: UITextField!
  @IBOutlet weak var spCreateAccountUsername: UITextField!
  @IBOutlet weak var spCreateAccountPassword: UITextField!
  @IBOutlet weak var spCreateAccountConfirmPassword: UITextField!
  
  @IBOutlet weak var spSignUpScrollView: UIScrollView!
  
  var currentTextField = UITextField()
  var pickerView = UIPickerView()
  
 let states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
  
  let typeOfCompany = ["Partnership", "Limited Liability Partnership", "Limited Liability Corporation", "C-Corporation", "S-Corporation", "Not-For-Profit"]
  
  var selectedState: String?
  var selectedTypeOfCompany: String?
  let spController = MWSPController()
  

  override func viewDidLoad() {
        super.viewDidLoad()
    
    pickerView.delegate = self
    pickerView.dataSource = self
    
    spCreateAccountState.inputView = pickerView
    spCreateAccountTypeOfCompany.inputView = pickerView
    
    
        configureTextFields()
        confirgureTapGesture()
        createToolBar()
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillHideNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
    }
  
  deinit {
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillHideNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
  }
  
  private func confirgureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(SPSignUpController.handleTap))
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
      spSignUpScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
    } else {
      spSignUpScrollView.contentInset = UIEdgeInsets.zero
    }
  }
  
  private func configureTextFields() {
    spCreateAccountTypeOfCompany.delegate = self
    spCreateAccountFirstName.delegate = self
    spCreateAccountLastName.delegate = self
    spCreateAccountEmail.delegate = self
    spCreateAccountCellPhone.delegate = self
    spCreateAccountAddress.delegate = self
    spCreateAccountState.delegate = self
    spCreateAccountCity.delegate = self
    spCreateAccountZip.delegate = self
    spCreateAccountCounty.delegate = self
    spCreateAccountUsername.delegate = self
    spCreateAccountPassword.delegate = self
    spCreateAccountConfirmPassword.delegate = self
  }
  
  
  func createToolBar() {
    let toolBar = UIToolbar()
    toolBar.sizeToFit()
    
    let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(SPSignUpController.handleTap))
    
    toolBar.setItems([doneButton], animated: false)
    toolBar.isUserInteractionEnabled = true
    
    spCreateAccountState.inputAccessoryView = toolBar
    spCreateAccountTypeOfCompany.inputAccessoryView = toolBar
  }
  
  
  
  
  @IBAction func signUpSP(_ sender: Any) {
    guard let typeOfCompany = spCreateAccountTypeOfCompany.text, spCreateAccountTypeOfCompany.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let email = spCreateAccountEmail.text, spCreateAccountEmail.text?.count != 0, isValidEmail(emailID: email) != false  else { let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
      enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidEmailAlert, animated: true, completion: nil)
      return}
    
    guard let password = spCreateAccountPassword.text, spCreateAccountPassword.text?.count != 0, isPasswordValid(password: password) != false else { let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
      enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidPasswordAlert, animated: true, completion: nil)
      return}
    
    guard let username = spCreateAccountUsername.text, spCreateAccountUsername.text?.count != 0 else { let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
      enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidUsernameAlert, animated: true, completion: nil)
      return }
    
    guard let firstName = spCreateAccountFirstName.text, spCreateAccountFirstName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let lastName = spCreateAccountLastName.text, spCreateAccountLastName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    
    guard let cellPhone = spCreateAccountCellPhone.text, spCreateAccountCellPhone.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let address = spCreateAccountAddress.text, spCreateAccountAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let state = spCreateAccountState.text, spCreateAccountState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let city = spCreateAccountCity.text, spCreateAccountCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let zip = spCreateAccountZip.text, spCreateAccountZip.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let county = spCreateAccountCounty.text, spCreateAccountCounty.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
    
    
    if spCreateAccountConfirmPassword.text == spCreateAccountPassword.text {
      
      spController.createNewSP(withEmail: email , password: password)
      
      spController.createSPData(typeOfCompany: typeOfCompany, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: username, password: password)
      
      showAlert(title: "Congratulations! Your account has been setup." , message: "Thank you for setting up an account. Please check your email to verify your account. Login to manage your maintenance process!", style: .alert, handler: proceedToSPLogin)
    } else {
      showAlert(title: "Passwords must match", message: "Confirmation password entered does not match the previous one. Please try again", style: .alert, handler: emptyFields)
    }
    
  }
  
  @IBAction func dismissSignupView(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  
}

extension SPSignUpController: UIPickerViewDelegate, UIPickerViewDataSource {
  
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == spCreateAccountTypeOfCompany {
      spCreateAccountFirstName.becomeFirstResponder()
    } else if textField == spCreateAccountFirstName{
      spCreateAccountLastName.becomeFirstResponder()
    } else if textField == spCreateAccountLastName {
      spCreateAccountEmail.becomeFirstResponder()
    } else if textField == spCreateAccountEmail {
      spCreateAccountCellPhone.becomeFirstResponder()
    } else if textField == spCreateAccountCellPhone {
      spCreateAccountAddress.becomeFirstResponder()
    } else if textField == spCreateAccountAddress {
      spCreateAccountState.becomeFirstResponder()
    } else if textField == spCreateAccountState {
      spCreateAccountCity.becomeFirstResponder()
    } else if textField == spCreateAccountCity {
      spCreateAccountZip.becomeFirstResponder()
    } else if textField == spCreateAccountZip {
      spCreateAccountCounty.becomeFirstResponder()
    } else if textField == spCreateAccountCounty {
      spCreateAccountUsername.becomeFirstResponder()
    } else if textField == spCreateAccountUsername {
      spCreateAccountPassword.becomeFirstResponder()
    } else if textField == spCreateAccountPassword {
      spCreateAccountConfirmPassword.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }
  
  func isValidEmail(emailID: String) -> Bool {
  let emailRegEx = "[A-z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
  let emailTest = NSPredicate(format: "SELF MATCHES %@", emailRegEx)
  return emailTest.evaluate(with: emailID)
  }
  
  func isPasswordValid(password: String) -> Bool {
  let passwordRegEx = "^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[a-zA-z0-9]{8,}"
  let passwordTest = NSPredicate(format: "SELF MATCHES %@", passwordRegEx)
  return passwordTest.evaluate(with: password)
  }
  
  
  func isPhoneNumberValid(cellPhone: String) -> Bool {
  let cellPhoneRegEx = "^\\d{3}-\\d{3}-\\d{4}$"
  let cellPhoneTest = NSPredicate(format: "SELF MATCHES %@", cellPhoneRegEx)
  return cellPhoneTest.evaluate(with:cellPhone)
  }
  
  func numberOfComponents(in pickerView: UIPickerView) -> Int {
    return 1
  }
  
  func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
    if currentTextField == spCreateAccountTypeOfCompany {
      return typeOfCompany.count
    } else if currentTextField == spCreateAccountState {
      return states.count
    } else{
      return 0
    }
  }
  
  func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
    if currentTextField == spCreateAccountTypeOfCompany {
      return typeOfCompany[row]
    } else if currentTextField == spCreateAccountState {
      return states[row]
    } else {
      return ""
    }
  }
  
  func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
   
    
    if currentTextField == spCreateAccountTypeOfCompany {
      spCreateAccountTypeOfCompany.text = typeOfCompany[row]
      self.view.endEditing(true)
    } else if currentTextField == spCreateAccountState{
    spCreateAccountState.text = states[row]
      self.view.endEditing(true)
    }
  }
  
  func textFieldDidBeginEditing(_ textField: UITextField) {
    self.pickerView.dataSource = self
    self.pickerView.delegate = self
    currentTextField = textField
    if currentTextField == spCreateAccountTypeOfCompany{
      currentTextField.inputView = pickerView
    } else if currentTextField == spCreateAccountState {
      currentTextField.inputView = pickerView
    }
  }
  
  func showAlert(title: String, message: String, style: UIAlertController.Style = .alert, handler: ((UIAlertAction) -> Void)?) {
    let alertController = UIAlertController(title: title, message: message, preferredStyle: style)
    let okAction = UIAlertAction(title: "OK", style: .default, handler: handler)
    alertController.addAction(okAction)
    
    present(alertController, animated: true, completion: nil)
  }
  
  func proceedToSPLogin(sender: UIAlertAction) -> Void {
    let storyBoard = UIStoryboard(name: "Main", bundle: nil)
    let popUp = storyBoard.instantiateViewController(withIdentifier: "SPLoginController")
    self.present(popUp, animated: true, completion: nil)
  }
  
  func emptyFields(sender: UIAlertAction) -> Void {
    self.spCreateAccountPassword.text = ""
    self.spCreateAccountConfirmPassword.text = ""
  }
  
}
