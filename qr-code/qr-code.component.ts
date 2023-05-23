import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DefaultQrImgWith, DefaultQrWidth } from './constants/qr-config';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  standalone: true,
  imports: [CommonModule, QRCodeModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCodeComponent {
  @Input() qrLink: string;
  @Input() qrWidth = DefaultQrWidth;
  @Input() imageSrc = 'assets/favicon/favicon.svg';
  @Input() imgWidth = DefaultQrImgWith;
  @Input() additionalPrintInfo: string = null;

  public printQr(element: QRCodeComponent): void {
    const popup = window.open();
    const additionalInfo = this.additionalPrintInfo ? `<p>${this.additionalPrintInfo}</p>` : '';

    this.setPopupContent(popup, element, additionalInfo);

    popup.onload = () => {
      popup.print();
    };

    popup.onafterprint = () => {
      popup.close();
    };
  }

  public downloadQr(element: QRCodeComponent): void {
    const link = document.createElement('a');
    link.download = `${this.additionalPrintInfo || 'qr'}.png`;
    link.href = element.context.canvas.toDataURL('image/png');
    link.click();
  }

  private setPopupContent(popup: Window, qrCode: QRCodeComponent, additionalInfo: string) {
    popup.document.body.innerHTML = `
        ${additionalInfo}
        <img
          width="170"
          height="170"
          src="${qrCode.context.canvas.toDataURL('image/png')}"
          alt="qr-code"
        />
      `;
  }
}
