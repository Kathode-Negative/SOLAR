import { useEffect, useState } from "react"
import { GET } from "../../api/fetchRequests"

/**
 * Speichert Daten im lokalen Speicher.
 * @param {string} key - Der Schlüssel, unter dem die Daten gespeichert werden.
 * @param {any} data - Die zu speichernden Daten.
 */
export function saveToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}

/**
 * Ruft Daten aus dem lokalen Speicher ab.
 * @param {string} key - Der Schlüssel der gespeicherten Daten.
 * @returns {any|null} - Gibt die gespeicherten Daten zurück oder null, falls sie nicht existieren.
 */
export function getFromLocal(key) {
    return JSON.parse(localStorage.getItem(key))
}

/**
 * Entfernt Daten aus dem lokalen Speicher.
 * @param {string} key - Der Schlüssel der zu löschenden Daten.
 */
export function deleteFromLocal(key) {
    localStorage.removeItem(key)
}

/**
 * Überprüft die Gültigkeit eines Tokens, indem eine Anfrage an das Backend gesendet wird.
 * @returns {Promise<boolean>} - Gibt true zurück, wenn das Token gültig ist, andernfalls false.
 */
export async function validateTokenFromBackend() {
    try {
        const token = getFromLocal('authToken')
        if(token == null){
            return false;
        }
        const response = await GET('/api/validateToken',{
                    'Content-Type': 'application/json',
                    'authorization':  token,
                })
        if (!response.ok) {
            return false;
        }else{
            return true;
        }
    }
    catch (error) {
        console.error(error)
        return false;
    }
}
