import { Injectable } from '@angular/core';
import { ErrorHandlingService } from './error-handling.service';
import { Observable } from 'rxjs/internal/Observable';
import { PaginationMetaDataDto } from '../../shared/models/paginationMetaDataDto.model';

/**
 * A service for serializing and deserializing XML data.
*/
@Injectable({
  providedIn: 'root'
})
export class XmlSerializerService {
  constructor(private errorHandlingService: ErrorHandlingService) { }

  /**
   * Serializes a JavaScript object into an XML string.
   * 
   * @param {any} obj - The object to serialize.
   * @param {string} rootElement - The root element of the XML structure.
   * @returns {string} The serialized XML string.
  */
  serialize(obj: any, rootElement: string): string {
    let xml = `<${rootElement}>`;
    for (const prop in obj) {
      xml += `<${prop}>${obj[prop]}</${prop}>`;
    }
    xml += `</${rootElement}>`;
    return xml;
  }

  /**
   * Deserializes an XML string into a JavaScript object.
   * 
   * @param {string} xml - The XML string to deserialize.
   * @returns {T} The deserialized JavaScript object of type T.
   * @template T - The type of the resulting object.
  */
  deserialize<T>(xml: string): T {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const obj: any = {};

    const errorNode = xmlDoc.getElementsByTagName('parsererror');
    if (errorNode.length) {
      this.errorHandlingService.handleSerializationError(new Error('Error parsing XML: ' + errorNode[0].textContent));
      return {} as T;
    }

    xmlDoc.documentElement.childNodes.forEach((node: Node) => {
      if (node.nodeType === 1) {
        obj[node.nodeName] = node.textContent;
      }
    });

    return obj as T;
  }

  /**
   * Deserializes an XML string into a boolean value.
   * 
   * @param {string} xml - The XML string to deserialize.
   * @returns {boolean} The deserialized boolean value.
  */
  deserializeBoolean<Boolean>(xml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const booleanElement = xmlDoc.getElementsByTagName("boolean")[0];

    if (booleanElement) {
      return booleanElement.textContent === "true";
    }
    return false;
  }

  /**
   * Deserializes an XML string containing pagination metadata into a PaginationMetaDataDto object.
   * 
   * @param {string} xml - The XML string containing pagination metadata.
   * @returns {PaginationMetaDataDto} The deserialized pagination metadata.
  */
  deserializePaginationMetaData(xml: string): PaginationMetaDataDto {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const obj: PaginationMetaDataDto = { totalCount: 0, pageSize: 0, currentPage: 0, totalPages: 0 };

    const errorNode = xmlDoc.getElementsByTagName('parsererror');
    if (errorNode.length) {
      this.errorHandlingService.handleSerializationError(new Error('Error parsing XML: ' + errorNode[0].textContent));
      return obj;
    }

    xmlDoc.documentElement.childNodes.forEach((node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const propName = node.nodeName as keyof PaginationMetaDataDto;
        if (propName in obj) {
          obj[propName] = Number(node.textContent) || 0;
        }
      }
    });

    return obj;
  }

  /**
   * Deserializes an XML string into an array of objects of a specified type.
   * 
   * @param {string} xml - The XML string to deserialize.
   * @param {'AuthorDto' | 'AuthorHaikuDto' | 'UserDto' | 'UserHaikuDto' | 'ProfileDto'} itemType - The type of items in the array.
   * @returns {T[]} The deserialized array of objects of type T.
   * @template T - The type of the items in the array.
  */
  deserializeArray<T>(xml: string, itemType: 'AuthorDto' | 'AuthorHaikuDto' | 'UserDto' | 'UserHaikuDto' | 'ProfileDto'): T[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    const errorNode = xmlDoc.getElementsByTagName('parsererror');
    if (errorNode.length) {
      this.errorHandlingService.handleSerializationError(new Error('Error parsing XML: ' + errorNode[0].textContent));
      return [];
    }

    const objArray: T[] = [];
    const items = xmlDoc.getElementsByTagName(itemType);

    for (let i = 0; i < items.length; i++) {
      const node = items[i];
      const item: any = {};
      node.childNodes.forEach((childNode: Node) => {
        if (childNode.nodeType === 1) {
          const propName = childNode.nodeName;
          item[propName] = childNode.textContent;
        }
      });
      objArray.push(item);
    }

    return objArray;
  }
}
