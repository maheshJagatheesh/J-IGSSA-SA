import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/services/shared.service';
import { DomController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

export interface SchoolData {
  schoolName: string;
  logo: string;
  address1: string;
  address2: string;
  address3: string;
  phone: string;
  urls: string;
  email: string;
}

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  currentView: number = 1;
  schoolList: SchoolData[] = [
    {
      schoolName: 'Arden Anglican School',
      logo: '../../assets/logo/school1.png',
      address1: '6B Essex St',
      address2: 'Epping NSW 2121 Australia',
      address3: '',
      phone: '(02) 9869 2644',
      urls: 'www.arden.nsw.edu.au',
      email: 'enquiry@arden.nsw.edu.au',
    },
    {
      schoolName: 'Arndell Anglican College',
      logo: '../../assets/logo/school2.png',
      address1: '100-124 Wolseley Rd',
      address2: 'Oakville NSW 2765 Australia',
      address3: '',
      phone: '(02) 4572 3633',
      urls: 'www.arndell.nsw.edu.au',
      email: 'enquiry@arndell.nsw.edu.au',
    },
    {
      schoolName: 'Australian International Academy',
      logo: '../../assets/logo/school3.png',
      address1: 'Kellyville Campus',
      address2: '57-69 Samantha Riley Dve (Cnr Foxall Rd)',
      address3: 'Kellyville NSW 2155 Australia',
      phone: '(02) 8801 3100',
      urls: 'www.aia.nsw.edu.au',
      email: 'admin@aia.nsw.edu.au',
    },
    {
      schoolName: 'Gilroy Catholic College',
      logo: '../../assets/logo/school4.png',
      address1: 'Marie St',
      address2: 'Castle Hill NSW 2154 Australia',
      address3: '',
      phone: '(02) 8853 8200',
      urls: 'www.gilroy.catholic.edu.au',
      email: 'gilroy@parra.nsw.edu.au  ',
    },
    {
      schoolName: 'Hills Adventist College',
      logo: '../../assets/logo/school5.png',
      address1: '4 Gum Nut Close',
      address2: 'Kellyville NSW 2155 Australia',
      address3: '',
      phone: '(02) 9851 5100',
      urls: 'www.hills.adventist.edu.au ',
      email: 'kellyville@hills.adventist.edu.au',
    },
    {
      schoolName: 'Marian Catholic College',
      logo: '../../assets/logo/school6.png',
      address1: '28 Annangrove Rd',
      address2: 'Kenthurst NSW 2156 Australia',
      address3: '',
      phone: '(02) 9654 6700',
      urls: 'www.mariancollege.nsw.edu.au',
      email: 'marian@parra.catholic.edu.au',
    },
    {
      schoolName: 'Masada College',
      logo: '../../assets/logo/school7.png',
      address1: '9-15 Link Rd',
      address2: 'St Ives NSW 2075 Australia',
      address3: '',
      phone: '(02) 9449 3744',
      urls: 'www.masada.nsw.edu.au',
      email: 'masada@masada.nsw.edu.au',
    },
    {
      schoolName: 'Montgrove',
      logo: '../../assets/logo/school8.png',
      address1: '140 Bringelly Rd',
      address2: 'Orchard Hills NSW 2748 Australia',
      address3: '',
      phone: '(02) 4736 5977',
      urls: 'www.montgrove.nsw.edu.au',
      email: 'admin@montgrove.nsw.edu.au',
    },
    {
      schoolName: 'Northholm Grammar School',
      logo: '../../assets/logo/school9.png',
      address1: '79 Cobah Road',
      address2: 'Arcadia NSW 2159 Australia',
      address3: '',
      phone: '(02) 9656 2000',
      urls: 'www.northholm.nsw.edu.au',
      email: '',
    },
    {
      schoolName: 'Pacific Hills',
      logo: '../../assets/logo/school10.png',
      address1: '9-15 Quarry Rd',
      address2: 'Dural NSW 2158 Australia',
      address3: '',
      phone: '(02) 9651 0700',
      urls: 'www.pacifichills.net',
      email: 'info@pacifichills.net',
    },
    {
      schoolName: 'Rouse Hill Anglican College',
      logo: '../../assets/logo/school11.png',
      address1: 'Cnr Rouse & Worcester Rd',
      address2: 'Rouse Hill NSW 2155 Australia',
      address3: '',
      phone: '(02) 8824 5844',
      urls: 'www.rhac.nsw.edu.au',
      email: 'info@rhac.nsw.edu.au',
    },
    {
      schoolName: 'Tangara School for Girls',
      logo: '../../assets/logo/school12.png',
      address1: '77-97 Franklin Road',
      address2: 'Cherrybrook NSW 2126 Australia',
      address3: '',
      phone: '(02) 9680 4844',
      urls: 'www.tangara.nsw.edu.au',
      email: 'admin@tangara.nsw.edu.au',
    },
    {
      schoolName: 'The Hills Grammar School',
      logo: '../../assets/logo/school13.png',
      address1: '43 Kenthurst Rd',
      address2: 'Kenthurst NSW 2156 Australia',
      address3: '',
      phone: '(02) 9654 2111',
      urls: 'www.hillsgrammar.nsw.edu.au',
      email: ' reception@hillsgrammar.nsw.edu.au',
    },
    {
      schoolName: 'William Clarke College',
      logo: '../../assets/logo/school14.png',
      address1: '1 Morris Grove',
      address2: 'Kellyville NSW 2155 Australia',
      address3: '',
      phone: '(02) 8882 2100',
      urls: 'www.wcc.nsw.edu.au',
      email: 'info@wcc.nsw.edu.au',
    },
    {
      schoolName: 'Wollemi College',
      logo: '../../assets/logo/school15.png',
      address1: '4 Gipps Street',
      address2: 'Werrington NSW 2747 Australia',
      address3: '',
      phone: '(02) 9833 0499',
      urls: 'www.wollemi.nsw.edu.au',
      email: 'info@wollemi.nsw.edu.au',
    },
  ];

  activeTab: string = '';
  // lastActiveTabSub: Subscription

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private domCtrl: DomController
  ) {}

  ngOnInit() {
    this.activeTab = this.sharedService.lastActiveTab;
  }

  ionViewWillEnter() {
    const content = document.querySelector('#content');
    const innerScroll = content.shadowRoot.querySelector('.inner-scroll');

    this.domCtrl.write(() => {
      //(innerScroll as any).style.background = "url('../../assets/img/bg/morePage.png') no-repeat center center / cover";
      innerScroll.setAttribute(
        'style',
        'background: url("../../assets/img/bg/morePage.png") no-repeat center center / cover'
      );
    });
  }

  set view(view: number) {
    this.currentView = view;
  }

  get view() {
    return this.currentView;
  }

  async openWebPage(url: string) {
    await Browser.open({ url: url });
  }

  toogleView(view: number) {
    this.currentView = view;
  }

  onClose() {
    if (this.activeTab) {
      if (this.activeTab == 'teams') {
        this.router.navigateByUrl(`/home/tabs/${this.activeTab}/0`);
      } else {
        this.router.navigateByUrl(`/home/tabs/${this.activeTab}`);
      }
    } else {
      this.router.navigateByUrl(`/home/tabs/lader`);
    }
  }

  // ngOnDestroy(){
  //   // this.ionViewWillLeave();
  // }

  ionViewWillLeave() {
    // console.log("inside ionViewWillLeave=======>")
  }
}
