//
//  SpTeamDisplayController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class SpTeamDisplayController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
  
  var spTeamReference: CollectionReference!
  var spTeamArray = [SPTeam]()
  
  @IBOutlet weak var spManageMyAccount: UIButton!
  @IBOutlet weak var spManageMyAccountView: UIView!
  @IBOutlet weak var spTeamMemberDIsplay: UICollectionView!
  
  override func viewWillAppear(_ animated: Bool) {
    loadSPTeamData()
  }
  
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
      
        spTeamReference = Firestore.firestore().collection("User").document("Service Provider").collection("MyTeam")
    }
  
  func loadSPTeamData() {
    spTeamReference.addSnapshotListener { (snapshot, error) in
      if error != nil {
        print("\(String(describing: error?.localizedDescription))")
        return
      } else {
        guard let snapshot = snapshot else {return}
        let spTeamData = snapshot.documents.compactMap({SPTeam(dictionary: $0.data())})
        self.spTeamArray = spTeamData
        DispatchQueue.main.async {
          self.spTeamMemberDIsplay.reloadData()
        }
      }
    }
  }
  
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return spTeamArray.count
  }
  
  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let identifier = "SPTeamCell"
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: identifier, for: indexPath) as! SPTeamCell
    
    let spTeam = spTeamArray[indexPath.item]
    let fullTitle = "\(spTeam.firstName) \(spTeam.lastName), \(spTeam.assignRole)"
    
    cell.spTeamMemberName.titleLabel?.text = fullTitle
    
    return cell
  }
  
  
  @IBAction func dismissManageMyAccount(_ sender: Any) {
    spManageMyAccountView.isHidden = true
  }
  
  @IBAction func closeManageMyAccount(_ sender: Any) {
    spManageMyAccountView.isHidden = true
  }
  
  @IBAction func showManageMyAccount(_ sender: Any) {
    spManageMyAccountView.isHidden = false
  }
  
  

}
