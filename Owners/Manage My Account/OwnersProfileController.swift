//
//  OwnersProfileController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/7/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase


class OwnersProfileController: UIViewController, UITableViewDelegate, UITableViewDataSource {
  
  var ownerReference: DocumentReference!
  var ownerNameArray = [Owner]()

  @IBOutlet weak var ownersProfile: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        ownerReference = Firestore.firestore().collection("User").document("Owner")
        loadData()
    }
  
  func loadData() {
    ownerReference.getDocument { (document, error) in
      if let sp = document.flatMap({ $0.data().flatMap({ (data) in
        return Owner(dictionary: data)
      })
      }) {
        self.ownerNameArray.append(sp)
        DispatchQueue.main.async {
          self.ownersProfile.reloadData()
        }
      } else {
        print("error retrieving renter: \(String(describing: error?.localizedDescription))")
      }
    }
  }
  
  
  
    @IBAction func signOutProfile(_ sender: Any) {
      do {
        try! Auth.auth().signOut()
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let popUP = storyboard.instantiateViewController(withIdentifier: "OwnerLoginController")
        self.present(popUP, animated: true, completion: nil)
      } catch let error{
        print("Failed to sign out with error \(error.localizedDescription)")
      }
    }
  
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return ownerNameArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIdentifier = "OwnersProfileCell"
        guard let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath) as? OwnersProfileCell else {
            fatalError("not an instance of OwnersProfileCell")
        }
        
        let owner = ownerNameArray[indexPath.row]
      
        cell.ownersProfileLabel.text = "Welcome \(owner.firstName)"
        
        return cell
    }

}
