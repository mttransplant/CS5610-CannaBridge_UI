import React from 'react';
import { Table } from 'react-bootstrap';

export default function ContactUs() {
  return (
    <div>
      <Table bordered condensed>
        <tbody>
          <tr>
            <td>Phone:</td>
            <td>617-xxx-xxxx</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td><a href="mailto:info@cannabridge.com">info@cannabridge.com</a></td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              1234 Main St.
              <br />
              Somewhereville, MA, 02111
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
