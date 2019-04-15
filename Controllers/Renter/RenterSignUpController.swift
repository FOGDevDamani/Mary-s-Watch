//
//  RenterSignUpController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/8/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import FirebaseFirestore

class RenterSignUpController: UIViewController, UITextFieldDelegate {

  @IBOutlet weak var renterScrollView: UIScrollView!
  
  var selectedState: String?
  let renterController = MWRenterController()
	var renterSignUpView: RenterSignUpView!
	{
		guard isViewLoaded else { return nil }
		return (view as! RenterSignUpView)
	}
  
  let states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
  

  
  override func viewDidLoad() {
        super.viewDidLoad()
    
    

        // Do any additional setup after loading the view.
        confirgureTapGesture()
        configureTextFields()
        createStatePicker()
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
  
  func createStatePicker() {
    let statePicker = UIPickerView()
    statePicker.delegate = self
    
    renterSignUpView.renterStateTextField.inputView = statePicker
    
  }
  
  func createToolBar() {
    let toolBar = UIToolbar()
    toolBar.sizeToFit()
    
    let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(RenterSignUpController.handleTap))
    
    toolBar.setItems([doneButton], animated: false)
    toolBar.isUserInteractionEnabled = true
    
    renterSignUpView.renterStateTextField.inputAccessoryView = toolBar
  }
  
  private func confirgureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(RenterSignUpController.handleTap))
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
      renterScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
    } else {
      renterScrollView.contentInset = UIEdgeInsets.zero
    }
  }
  
  private func configureTextFields() {
    renterSignUpView.renterFirstNameTextField.delegate = self
    renterSignUpView.renterLastNameTextField.delegate = self
    renterSignUpView.renterEmailTextField.delegate = self
    renterSignUpView.renterCellPhoneTextField.delegate = self
    renterSignUpView.renterAddressTextField.delegate = self
    renterSignUpView.renterStateTextField.delegate = self
    renterSignUpView.renterCityTextField.delegate = self
    renterSignUpView.renterZipcodeTextField.delegate = self
    renterSignUpView.renterCountyTextField.delegate = self
    renterSignUpView.renterUsernameTextField.delegate = self
    renterSignUpView.renterPasswordTextField.delegate = self
    renterSignUpView.renterConfirmPasswordTextField.delegate = self
  }
  
  
  
  
  @IBAction func signUpRenter(_ sender: Any) {
    guard let email = renterSignUpView.renterEmailTextField.text, renterSignUpView.renterEmailTextField.text?.count != 0, isValidEmail(emailID: email) != false  else { let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
      enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidEmailAlert, animated: true, completion: nil)
      return}
    guard let password = renterSignUpView.renterPasswordTextField.text, renterSignUpView.renterPasswordTextField.text?.count != 0, isPasswordValid(password: password) != false else { let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
      enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidPasswordAlert, animated: true, completion: nil)
      return}
    guard let username = renterSignUpView.renterUsernameTextField.text, renterSignUpView.renterUsernameTextField.text?.count != 0  else { let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
      enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidUsernameAlert, animated: true, completion: nil)
      return }
    guard let firstName =  renterSignUpView.renterFirstNameTextField.text,  renterSignUpView.renterFirstNameTextField.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let lastName = renterSignUpView.renterLastNameTextField.text, renterSignUpView.renterLastNameTextField.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    guard let cellPhone = renterSignUpView.renterCellPhoneTextField.text, renterSignUpView.renterCellPhoneTextField.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let address = renterSignUpView.renterAddressTextField.text, renterSignUpView.renterAddressTextField.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let state = renterSignUpView.renterStateTextField.text, renterSignUpView.renterStateTextField.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let city = renterSignUpView.renterCityTextField.text, renterSignUpView.renterCityTextField.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let zip = renterSignUpView.renterZipcodeTextField.text, renterSignUpView.renterZipcodeTextField.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let county = renterSignUpView.renterCountyTextField.text, renterSignUpView.renterCountyTextField.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    
    if renterSignUpView.renterConfirmPasswordTextField.text == renterSignUpView.renterPasswordTextField.text {
      
      renterController.createNewRenter(email: email, password: password)
      
      renterController.createRenterData(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: username, password: password)
      
      
     showAlert(title: "Congratulations! Your account has been setup." , message: "Thank you for setting up an account. Please check your email to verify your account. Login to manage your maintenance process!", style: .alert, handler: proceedToRenterLogin)
    } else {
      showAlert(title: "Passwords must match", message: "Confirmation password entered does not match the previous one. Please try again", style: .alert, handler: emptyFields)
    }
  }
  
  
  @IBAction func dismissSignupView(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  

}

extension RenterSignUpController: UIPickerViewDelegate, UIPickerViewDataSource {
  
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == renterSignUpView.renterFirstNameTextField {
      renterSignUpView.renterLastNameTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterLastNameTextField{
      renterSignUpView.renterEmailTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterEmailTextField {
      renterSignUpView.renterCellPhoneTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterCellPhoneTextField{
      renterSignUpView.renterAddressTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterAddressTextField {
      renterSignUpView.renterStateTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterStateTextField{
      renterSignUpView.renterCityTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterCityTextField {
      renterSignUpView.renterZipcodeTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterZipcodeTextField {
      renterSignUpView.renterCountyTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterCountyTextField {
      renterSignUpView.renterUsernameTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterUsernameTextField {
      renterSignUpView.renterPasswordTextField.becomeFirstResponder()
    } else if textField == renterSignUpView.renterPasswordTextField {
      renterSignUpView.renterConfirmPasswordTextField.becomeFirstResponder()
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
    return states.count
  }
  
  func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
    return states[row]
  }
  
  func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
    selectedState = states[row]
    renterSignUpView.renterStateTextField.text = selectedState
  }
  
  func showAlert(title: String, message: String, style: UIAlertController.Style = .alert, handler: ((UIAlertAction) -> Void)?) {
    let alertController = UIAlertController(title: title, message: message, preferredStyle: style)
    let okAction = UIAlertAction(title: "OK", style: .default, handler: handler)
    alertController.addAction(okAction)
    
    present(alertController, animated: true, completion: nil)
  }
  
  func proceedToRenterLogin(sender: UIAlertAction) -> Void {
    let storyBoard = UIStoryboard(name: "Main", bundle: nil)
    let popUp = storyBoard.instantiateViewController(withIdentifier: "RenterLoginController")
    self.present(popUp, animated: true, completion: nil)
  }
  
  func emptyFields(sender: UIAlertAction) -> Void {
    self.renterSignUpView.renterPasswordTextField.text = ""
    self.renterSignUpView.renterConfirmPasswordTextField.text = ""
  }
  
}
