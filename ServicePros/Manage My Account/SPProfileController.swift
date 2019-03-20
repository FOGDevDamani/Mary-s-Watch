//
//  SPProfileController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import Foundation

class SPProfileController: UIViewController, UITableViewDelegate, UITableViewDataSource {
  
  var spReference: DocumentReference!
  var spNameArray = [ServiceProvider]()
  
  @IBOutlet weak var spProfileImage: UIImageView!
  
  @IBOutlet weak var spProfileView: UITableView!
  
  @IBOutlet weak var changeProfileImage: UIButton!
  
  
  
  var imagePicker: UIImagePickerController!
  
  

    override func viewDidLoad() {
        super.viewDidLoad()

        spReference = Firestore.firestore().collection("User").document("Service Provider")
        loadData()
      
      let imageTap = UITapGestureRecognizer(target: self, action: #selector(openImagePicker))
      spProfileImage.isUserInteractionEnabled = true
      spProfileImage.addGestureRecognizer(imageTap)
      changeProfileImage.addTarget(self, action: #selector(openImagePicker), for: .touchUpInside)
      
        imagePicker = UIImagePickerController()
        imagePicker.allowsEditing = true
        imagePicker.sourceType = .photoLibrary
        imagePicker.delegate = self
      
    }
  
  @objc func openImagePicker(sender: Any) {
    self.present(imagePicker, animated: true, completion: nil)
  }
  
  
  @IBAction func uploadProfilemage(_ sender: Any) {
    
  }
  
  
  @IBAction func signOutSPProfile(_ sender: Any) {
    do{
      try! Auth.auth().signOut()
      let storyBoard = UIStoryboard(name: "Main", bundle: nil)
      let goToLogin = storyBoard.instantiateViewController(withIdentifier: "SPLoginController")
      self.present(goToLogin, animated: true, completion: nil)
    } catch {
      print("Error signing out: \(error.localizedDescription)")
    }
  }
  
  func uploadProfileImage(_ image: UIImage, completion: @escaping((_ url:String?) -> ())) {
    guard let uid = Auth.auth().currentUser?.uid else {return}
    let storageRef = Storage.storage().reference().child("user/\(uid)")
    
    let imageData = UIImage.jpegData(image)
    
  }
  
  func loadData() {
    spReference.getDocument { (document, error) in
      if let sp = document.flatMap({ $0.data().flatMap({ (data) in
        return ServiceProvider(dictionary: data)
      })
      }) {
        self.spNameArray.append(sp)
        DispatchQueue.main.async {
          self.spProfileView.reloadData()
        }
      } else {
        print("error retrieving renter: \(String(describing: error?.localizedDescription))")
      }
    }
  }
  
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return spNameArray.count
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let identifier = "SPProfileCell"
    let cell = tableView.dequeueReusableCell(withIdentifier: identifier, for: indexPath) as! SPProfileCell
    
    let sp = spNameArray[indexPath.row]
    
    cell.spProfileDisplayName.text = "Welcome \(sp.userName)"
    
    return cell
  }

}

extension SPProfileController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
  
  func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
    picker.dismiss(animated: true, completion: nil)
  }
  
  func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
    
    if let pickedImage = info[UIImagePickerController.InfoKey.editedImage] as? UIImage {
      self.spProfileImage.image = pickedImage
    }
    
    picker.dismiss(animated: true, completion: nil)
  }
  
  
  
}
