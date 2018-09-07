//
//  OwnersProfileController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/7/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import FirebaseFirestore
import FirebaseAuth

class OwnersProfileController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    var reference: Firestore!
    var namesArray = [User]()
   
    
       @IBOutlet weak var ownersProfile: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        reference = Firestore.firestore()
       

    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
       watchForData()
    }
    
    func watchForData() {
        reference.collection("User").addSnapshotListener { (snapShot, error) in
            if let error = error {
                print("\(error.localizedDescription)")
            } else {
                guard let snapShot = snapShot else {return}
                let models = snapShot.documents.compactMap({ User(dictionary: $0.data())})
                self.namesArray = models
                DispatchQueue.main.async {
                    self.ownersProfile.reloadData()
                }
            }
        }
        
    }
    
    
    @IBAction func signOutProfile(_ sender: Any) {
        try! Auth.auth().signOut()
        self.dismiss(animated: false, completion: nil)
    }
    

    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return namesArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIdentifier = "OwnersProfileCell"
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath) as? OwnersProfileCell else {
            fatalError("not an instance of OwnersProfileCell")
        }
        
        let name = namesArray[indexPath.row]
        let fullName = "\(name.firstName) \(name.lastName)"

        cell.ownersProfileLabel.text = fullName
        
        return cell
    }

   
}
